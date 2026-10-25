import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../../../database/providers/drizzle.provider";
import { usersTable } from "../../../database/schemas/userSchema";
import { User } from "../../domain/user.entity";
import type { UserRepository } from "../../domain/user.repository";
import type { UserRole } from "../../domain/value-objects/user-role";
import { UserAlreadyExistisError } from "../../app/error/user-already-existis";
import { userUnitTable } from "../../../database/schemas/userUnitSchema";
import { ConflictError } from "../../../shared/domains/conflict.error";

@Injectable()
export class DrizzleUserRepository implements UserRepository{
    constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase){}

    async save(user: User): Promise<void> {
        const [existigUser] = await this.db.select()
        .from(usersTable)
        .where(and(
            eq(usersTable.firstName, user.firstName), 
            eq(usersTable.lastName, user.lastName))
        )
        
        if(existigUser){
            throw new UserAlreadyExistisError()
        }

        await this.db.transaction(async (tx) => {
            await tx.insert(usersTable).values({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            })

            await tx.insert(userUnitTable).values({
                unitId: user.unitId,
                userId: user.id
            })
        })
    }

    async findById(id: string): Promise<User | null> {
        const [user] = await this.db.select()
            .from(usersTable)
            .where(eq(usersTable.id, id))

        const [userUnit] = await this.db.select().from(userUnitTable).where(eq(userUnitTable.userId, id))
        
        if(!user){
            return null
        }

        if(!userUnit){
            throw new ConflictError("USER NOT IN A UNIT")
        }

        return User.reconstitute({
            id: user.id,
            unitId: userUnit.id,
            createdAt: user.createdAt,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role as UserRole,
            updatedAt: user.updatedAt
        })
    }
}
