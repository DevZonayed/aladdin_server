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
import { Request } from 'express';
import { Types } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { SubUnsubStrategyDto } from '../dto/sub-unsub-strategy.dto';
import { UpdateUserCredentialsDto } from '../dto/update-user-credentials.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../service/user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<void>;
    updateBinanceCredentials(request: Request, updateBinanceCredentials: UpdateUserCredentialsDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    subscribeToAStrategy(request: Request, subUnsubStrategyDto: SubUnsubStrategyDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    unSubscribeToAStrategy(request: Request, subUnsubStrategyDto: SubUnsubStrategyDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateUserDto: UpdateUserDto): import("mongoose").Query<import("mongoose").Document<unknown, {}, import("../entities/user.entity").User> & import("../entities/user.entity").User & {
        _id: Types.ObjectId;
    }, import("mongoose").Document<unknown, {}, import("../entities/user.entity").User> & import("../entities/user.entity").User & {
        _id: Types.ObjectId;
    }, {}, import("../entities/user.entity").User, "findOneAndUpdate">;
    remove(id: string): string;
}
