import { Account } from "./account.entity";

export const ACCOUNT_REPOSITORY = Symbol('ACCOUNT_REPOSITORY');

export interface AccountRepository{
    save(account: Account): Promise<void>
    findById(id: string): Promise<Account | null>
    findByProviderExternalId(id: string): Promise<Account | null>
    listAccount(): Promise<Account[]>
}