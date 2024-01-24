import { UserSigninBy } from '../../common/enum/enum-signin-by-social-id';
import { UserRole } from '../../common/enum/enum-user-role';
export declare class CreateUserDto {
    fullName: string;
    email: string;
    password: string;
    mobileNumber: string;
    address: string;
    status: boolean;
    termsAndCondition: boolean;
    roles: UserRole[];
    signinBy: UserSigninBy[];
    country: string;
    profileImage: string;
    sentMail: boolean;
    token: string;
}
