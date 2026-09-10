import { Inject, Injectable } from "@nestjs/common";
import { UserRole } from "../../domain/value-objects/user-role";
import { SyncMode, User } from "../../domain/user.entity";
import { USER_REPOSITORY, type UserRepository } from "../../domain/user.repository";

export interface CreateUserInput {
  firstName: string;
  lastName: string
  role: UserRole;
  syncMode: SyncMode
  externalId: string | null
}

@Injectable()
export class CreateUserUseCase{
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
    ) {}

    async execute(input: CreateUserInput): Promise<User>{
        const user = User.create(input)
        await this.userRepository.save(user)
        return user
    }
}
