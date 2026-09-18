import { User } from "../../users/domain/user.entity"
import { UserRole } from "../../users/domain/value-objects/user-role"
import { ExternalProvider } from "./account.entity"


export const USER_AND_ACCOUNT_PROVIDER = Symbol("USER_AND_ACCOUNT_PROVIDER") 

export type UserAndAccountReturnType = {
    userId: string
    firstName: string
    lastName: string
    account: {
        account_id: string
        email: string | null
        provider: ExternalProvider
        role: UserRole
    }
}

export interface UserAndAccountProvider{
    findByUserIdsAndProvider(users: User[], provider: ExternalProvider): Promise<UserAndAccountReturnType[]>
}