export class Email {
  private constructor(private readonly value: string) {}

  static create(value: string): Email {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new Error("email inválido");
    }

    return new Email(value.toLowerCase());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
