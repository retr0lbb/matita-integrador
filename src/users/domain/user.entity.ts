import { UserRole } from "./value-objects/user-role";

type ConversionPayload = {
    id: string
    externalId: string | null, 
    name: string, 
    email: string, 
    role: UserRole
}

export class User {
    private constructor(
        private readonly _id: string,
        private readonly _externalId: string | null,
        private _name: string,
        private _email: string,
        private readonly _role: UserRole
    ){}

    static create(props: Omit<ConversionPayload, "id">){
        if (!props.name.trim()) {
            throw new Error('nome não pode ser vazio');
        }

        if (!props.email.includes('@')) {
            throw new Error('email inválido');
        }

        return new User(crypto.randomUUID(), props.externalId, props.name, props.email, props.role)
    }

    static convertFromDb(props: ConversionPayload){
        return new User(props.id, props.externalId, props.name, props.email, props.role)
    }

    // Getters
    get id(): string {
        return this._id;
    }

    get externalId(): string | null {
        return this._externalId;
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get role(): UserRole {
        return this._role;
    }

    // Setters (com validações de invariantes)
    set name(value: string) {
        if (!value.trim()) {
            throw new Error('nome não pode ser vazio');
        }
        this._name = value;
    }

    set email(value: string) {
        if (!value.includes('@')) {
            throw new Error('email inválido');
        }
        this._email = value;
    }

    isProfessor(){
        return this._role === UserRole.PROFESSOR
    }
}