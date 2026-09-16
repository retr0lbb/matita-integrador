export const GOOGLE_ACCOUNT_PROVIDER = Symbol("GOOGLE_ACCOUNT_PROVIDER")

export interface CreateGoogleAccountInput{
    email: string,
    givenName: string,
    familyName: string,
    orgUnitPath?: string
}

export type GoogleAccountObject = { id: string; email: string; externalIds?: string[]; orgPath?: string, givenName: string, familyName: string}

export interface GoogleAccountProviderClient{
    createAccount(input: CreateGoogleAccountInput): Promise<string>
    listAllAccounts(orgPath: string): Promise<Array<GoogleAccountObject>>
    findAccount(key: string): Promise<{id: string, email: string} | null>
    deleteAccount(key: string, uoPath: string): Promise<void>
}