import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { UserRole } from "../../domain/user-role";
import { User } from "../../domain/user.entity";
import { USER_REPOSITORY, type UserRepository } from "../../domain/user.repository";

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
  externalId: string | null
}

@Injectable()
export class CreateUserUseCase{
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

    async execute(input: CreateUserInput): Promise<User>{
        const existing = await this.userRepository.findByEmail(input.email)

        if(existing){
            throw new BadRequestException("Ja existe um usuario com esse email")
        }

        const user = User.create({...input})
        await this.userRepository.save(user)

        return user
    }
}
