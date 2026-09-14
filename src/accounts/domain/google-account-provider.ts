
export const GOOGLE_ACCOUNT_PROVIDER = Symbol("GOOGLE_ACCOUNT_PROVIDER")

export interface CreateGoogleAccountInput{
    email: string,
    givenName: string,
    familyName: string,
    orgUnitPath?: string
}

export interface GoogleAccountProviderClient{
    createAccount(input: CreateGoogleAccountInput): Promise<string>
    findAccountById(accountId: string): Promise<any>
}