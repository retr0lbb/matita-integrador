export class Email{
    private constructor(private readonly value: string | null){}

    static create(value: string | null): Email{
        if(value === null){
            return new Email(null)
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            throw new Error('email inválido');
        }

        return new Email(value.toLowerCase());
    }

    getValue(): string | null{
        return this.value
    }

    equals(other:Email){
        return this.value === other.value
    }
}