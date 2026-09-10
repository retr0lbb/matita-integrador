import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { SyncMode, User } from "../../domain/user.entity";
import { UserRepository } from "../../domain/user.repository";
import { DRIZZLE } from "../../../database/providers/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { usersTable } from "../../../database/schemas/userSchema";
import { eq } from "drizzle-orm";
import { UserRole } from "../../domain/value-objects/user-role";

@Injectable()
export class DrizzleUserRepository implements UserRepository{
    constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase){}

    async save(user: User): Promise<void> {
        await this.db.insert(usersTable).values({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            syncMode: SyncMode.NONE,
        })
    }

    async findById(id: string): Promise<User | null> {
        const [user] = await this.db.select()
            .from(usersTable)
            .where(eq(usersTable.id, id))
        
        if(!user){
            throw new NotFoundException("User not found")        
        }

        return User.convertFromDb({
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id, 
            externalId: user.externalId,
            role: user.role as UserRole,
            syncMode: user.syncMode as SyncMode,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        })
    }
}