/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { Model, Types } from 'mongoose';
import { BinanceService } from 'src/binance/service/binance.service';
import { UpdateUserCredentialsDto } from 'src/user/dto/update-user-credentials.dto';
import { CreateSystemAdministratorDto } from '../../auth/dto/create-system-administrator.dto';
import { UserLoginDto } from '../../auth/dto/user-login.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
export declare class UserService {
    private readonly userModel;
    private cacheManager;
    private jwtService;
    private readonly binanceService;
    constructor(userModel: Model<User>, cacheManager: Cache, jwtService: JwtService, binanceService: BinanceService);
    create(createUserDto: CreateUserDto): Promise<void>;
    createSystemAdministrator(createSystemAdministratorDto: CreateSystemAdministratorDto): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    findByEmail(email: string): import("mongoose").Query<import("mongoose").Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    }, import("mongoose").Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    }, {}, User, "findOne">;
    findAll(): string;
    findOne(id: number): string;
    update(id: any, updateUserDto: UpdateUserDto): import("mongoose").Query<import("mongoose").Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    }, import("mongoose").Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    }, {}, User, "findOneAndUpdate">;
    remove(id: number): string;
    login(userLoginDto: UserLoginDto): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    getBinanceBalance(id: Types.ObjectId | string, apiKey?: string, apiSecret?: string): Promise<{
        balance: number | string;
        isTestMode: boolean;
    }>;
    updateBinanceCredentials(id: string, updateBinanceCredentialsDto: UpdateUserCredentialsDto): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    subscribeToStrategy(userId: string, strategyId: Types.ObjectId): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    unSubscribeToStrategy(userId: string, strategyId: Types.ObjectId): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    getCredentialsOfStrategy(strategyId: Types.ObjectId): Promise<any[]>;
    checkUserByEmail(email: any): Promise<(import("mongoose").Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    })[]>;
    checkUserByRoles(roles: any): Promise<(import("mongoose").Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    })[]>;
    hashPassword(password: any): Promise<string>;
    compareHashPassword(password: any, userPassword: any): Promise<boolean>;
    getAccessToken(response: any): Promise<{
        data: {
            sub: any;
            fullName: any;
            email: any;
            roles: any;
        };
        access_token: string;
    }>;
    checkSystemAdministratorUser(createSystemAdministrator: CreateSystemAdministratorDto): Promise<(import("mongoose").Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    })[]>;
    createSystemAdministratorUser(createSystemAdministrator: CreateSystemAdministratorDto): Promise<{
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
}
