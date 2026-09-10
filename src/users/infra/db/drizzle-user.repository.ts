import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "../../domain/user.entity";
import { UserRepository } from "../../domain/user.repository";
import { DRIZZLE } from "../../../database/providers/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { usersTable } from "../../../database/schemas";
import { eq } from "drizzle-orm";
import { UserRole } from "../../domain/value-objects/user-role";

@Injectable()
export class DrizzleUserRepository implements UserRepository{
    constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase){}

    async save(user: User): Promise<void> {
        await this.db.insert(usersTable).values({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
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
            email: user.email, 
            id: user.id, 
            externalId: user.externalId,
            name: user.name,
            role: user.role as UserRole
        })
    }

    async findByEmail(email: string): Promise<User | null> {
        const [user] = await this.db
        .select()
        .from(usersTable).where(eq(usersTable.email, email))

        if(!user){
            return null
        }

        return User.convertFromDb({email: user.email, externalId: user.externalId, id: user.id, name: user.name, role: user.role as UserRole})
    }
}