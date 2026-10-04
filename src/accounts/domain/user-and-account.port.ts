import { User } from "../../users/domain/user.entity"
import { UserRole } from "../../users/domain/value-objects/user-role"
import { ExternalProvider } from "./account.entity"


export const USER_AND_ACCOUNT_PROVIDER = Symbol("USER_AND_ACCOUNT_PROVIDER") 

export type UserAccount = {
    userId: string;
    accountId: string;
    email: string | null;
    provider: ExternalProvider;
};

export interface UserAndAccountProvider{
    findByUserIdsAndProvider(userIds: string[], provider: ExternalProvider): Promise<UserAccount[]>
}