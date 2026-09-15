import { UserRole } from "./value-objects/user-role";

type CreatePayload = {
    firstName: string,
    lastName: string,
    role: UserRole,
}

type ReconstitutePayload = {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date | null;
}

export class User {
    private constructor(
        private readonly _id: string,
        private _firstName: string,
        private _lastName: string,
        private readonly _role: UserRole,
        private readonly _createdAt: Date,
        private _updatedAt: Date | null,
    ){}

    static create(payload: CreatePayload){
        if (!payload.firstName.trim() || !payload.lastName.trim()) {
            throw new Error('nome e sobrenome não pode ser vazio');
        }

        return new User(
            crypto.randomUUID(), 
            payload.firstName, 
            payload.lastName, 
            payload.role,
            new Date(),
            null,
        )
    }

    static reconstitute(payload: ReconstitutePayload){
        return new User(
            payload.id,
            payload.firstName,
            payload.lastName,
            payload.role,
            payload.createdAt,
            payload.updatedAt
        )
    }

    getUORouting(){
        if(this._role === UserRole.ALUNO){
            return "ALUNOS"
        }
        if(this._role === UserRole.PROFESSOR){
            return "PROFESSORES"
        }
    }

    // Getters
    get id(): string {
        return this._id;
    }
    get firstName(): string {
        return this._firstName;
    }

    get lastName(): string {
        return this._lastName;
    }

    get role(): UserRole {
        return this._role;
    }

    get createdAt(): Date{
        return this._createdAt
    }

    get updatedAt(): Date | null{
        return this._updatedAt
    }

}