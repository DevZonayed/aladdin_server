import { MailerService } from '@nestjs-modules/mailer';
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CoreConfigService } from '../../common/config/core/core.service';
import { UserService } from '../../user/service/user.service';
import { CreateSystemAdministratorDto } from '../dto/create-system-administrator.dto';
import { UserLoginDto } from '../dto/user-login.dto';
import { userVerificationDto } from '../dto/user-verification.dto';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly mailService;
    private readonly config;
    constructor(userService: UserService, jwtService: JwtService, mailService: MailerService, config: CoreConfigService);
    login(userLoginDto: UserLoginDto): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    createUser(createUserData: CreateUserDto): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    verifyRegCode(verificationData: userVerificationDto, code: number): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    createSystemAdministrator(createSystemAdministrator: CreateSystemAdministratorDto): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    verifyToken(token: string): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    resetPassword(): string;
    tokenVerification(token: string): Promise<any>;
    sendUserRegistrationVerificationCodeMail(createUserData: CreateUserDto): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    sendSystemAdministratorVerificationMail(createSystemAdministrator: CreateSystemAdministratorDto): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
}
