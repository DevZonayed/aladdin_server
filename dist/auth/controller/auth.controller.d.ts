import { Request } from "express";
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateSystemAdministratorDto } from '../dto/create-system-administrator.dto';
import { UserLoginDto } from '../dto/user-login.dto';
import { userVerificationDto } from '../dto/user-verification.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    createSystemAdministrator(createSystemAdministrator: CreateSystemAdministratorDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    registration(createUserData: CreateUserDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    verifyVerificationCode(verificationData: userVerificationDto, request: Request): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    login(userLoginDto: UserLoginDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    resetPassword(): string;
    verifyToken(token: string): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
}
