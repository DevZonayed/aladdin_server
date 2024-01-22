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
import { Exchanges } from 'src/common/enum/enum-exchanges';
import { UserSigninBy } from '../../common/enum/enum-signin-by-social-id';
import { UserRole } from '../../common/enum/enum-user-role';
import { SentUserMailInterface } from '../../common/interface/sent-user-mail.interface';
import { BalenceInterface } from '../interfaces/balence.interface';
import { CredentialsInterface } from '../interfaces/credentials.interface';
export declare class User extends Document {
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
    sentMail: SentUserMailInterface;
    binanceCredentials: CredentialsInterface<Exchanges.Binance>;
    bybitCredentials: CredentialsInterface<Exchanges.Bybit>;
    strategys: Types.ObjectId[];
    binanceBalence: BalenceInterface<Exchanges.Binance>;
    token: string;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
}>;
