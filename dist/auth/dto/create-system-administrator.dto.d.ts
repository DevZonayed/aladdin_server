import { UserRole } from '../../common/enum/enum-user-role';
export declare class CreateSystemAdministratorDto {
    fullName: string;
    email: string;
    password: string;
    mobileNumber: string;
    roles: UserRole[];
}
