import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../../../database/providers/drizzle.provider";
import { usersTable } from "../../../database/schemas/userSchema";
import { User } from "../../domain/user.entity";
import type { UserRepository } from "../../domain/user.repository";
import type { UserRole } from "../../domain/value-objects/user-role";

@Injectable()
export class DrizzleUserRepository implements UserRepository{
    constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase){}

    async save(user: User): Promise<void> {
        await this.db.insert(usersTable).values({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        })
    }

    async findById(id: string): Promise<User | null> {
        const [user] = await this.db.select()
            .from(usersTable)
            .where(eq(usersTable.id, id))
        
        if(!user){
            return null
        }

        return User.reconstitute({
            id: user.id,
            createdAt: user.createdAt,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role as UserRole,
            updatedAt: user.updatedAt
        })
    }
}