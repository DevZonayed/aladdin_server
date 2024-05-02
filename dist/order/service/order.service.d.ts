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
import { Model } from 'mongoose';
import { SortBy } from 'src/common/enum/enum-sort-by';
import { Order } from '../entities/order.entity';
export declare class OrderService {
    private readonly OrderModel;
    constructor(OrderModel: Model<Order>);
    create(createOrderDto: any): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    findAll(page: number, limit: number, order: string, sort: SortBy, search: string, startDate: Date, endDate: Date): Promise<any>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    findAllOpenOrders(strategyId: string, userId: string): Promise<{
        status: boolean;
        data: (import("mongoose").Document<unknown, {}, Order> & Order & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        error?: undefined;
    } | {
        status: boolean;
        error: string;
        data?: undefined;
    }>;
    findOpenOrder(strategyId: string, copyOrderId: string, userId: string, symbol: string, side: string): Promise<{
        status: boolean;
        data: import("mongoose").Document<unknown, {}, Order> & Order & {
            _id: import("mongoose").Types.ObjectId;
        };
        error?: undefined;
    } | {
        status: boolean;
        error: string;
        data?: undefined;
    }>;
    update(id: string, updateOrderDto: any): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
}
