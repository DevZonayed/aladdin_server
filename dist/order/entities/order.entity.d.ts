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
import { Document, Types } from 'mongoose';
import { OrderSideEnum } from '../enums/OrderSide.enum';
import { ClosedByEnum } from '../enums/closedBy.enum';
import { CreatedByEnum } from '../enums/createdBy.enum';
import { OrderTypeEnum } from '../enums/orderType.enum';
import { StatusEnum } from '../enums/status.enum';
export declare class Order extends Document {
    userId: Types.ObjectId;
    strategyId: Types.ObjectId;
    copyOrderId: string;
    binanceOrderId: string;
    createdBy: CreatedByEnum;
    symbol: string;
    isRootOrder: boolean;
    type: OrderTypeEnum;
    side: OrderSideEnum;
    closedBy: ClosedByEnum;
    entryPrice: number;
    orderQty: number;
    closedQty: number;
    leverage: number;
    initialOrderRatio: number;
    isolated: boolean;
    status: StatusEnum;
    closeReason: string;
    reEntryCount: number;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order> & Order & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>> & import("mongoose").FlatRecord<Order> & {
    _id: Types.ObjectId;
}>;
