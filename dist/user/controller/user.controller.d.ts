import { Request } from 'express';
import { SortBy } from 'src/common/enum/enum-sort-by';
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
    findAll(page: number, limit: number, order: string, sort: SortBy, search: string, startDate: Date, endDate: Date): Promise<any>;
    findOne(id: string): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    remove(id: string): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
}
