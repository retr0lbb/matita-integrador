import { Account, ExternalProvider } from "./account.entity";

export const ACCOUNT_REPOSITORY = Symbol('ACCOUNT_REPOSITORY');

export interface AccountRepository{
    save(account: Account): Promise<void>
    findById(id: string): Promise<Account | null>
    findByProviderAndExternalId(provider:ExternalProvider ,id: string): Promise<Account | null>
    findByUserAndProvider(userId: string, accountProvider: ExternalProvider): Promise<Account | null>;
    findByEmailAndExternalProvider(email: string, provider: ExternalProvider): Promise<Account | null>;
    listAccount(): Promise<Account[]>
    updateGoogleIdForAccount(account: Account): Promise<void>
    setFailedPending(account: Account): Promise<void>
    delete(accountId: string): Promise<void>
}