import { Inject, Injectable } from "@nestjs/common";
import { UserRole } from "../../domain/value-objects/user-role";
import { User } from "../../domain/user.entity";
import { USER_REPOSITORY, type UserRepository } from "../../domain/user.repository";

export interface CreateUserInput {
  firstName: string;
  lastName: string
  role: UserRole;
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
