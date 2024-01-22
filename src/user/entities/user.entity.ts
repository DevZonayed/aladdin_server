import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Exchanges } from 'src/common/enum/enum-exchanges';
import { UserSigninBy } from '../../common/enum/enum-signin-by-social-id';
import { UserRole } from '../../common/enum/enum-user-role';
import { SentUserMailInterface } from '../../common/interface/sent-user-mail.interface';
import { BalenceInterface } from '../interfaces/balence.interface';
import { CredentialsInterface } from '../interfaces/credentials.interface';

@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  mobileNumber: string;

  @Prop()
  address: string;

  @Prop()
  status: boolean;

  @Prop({ type: Boolean })
  termsAndCondition: boolean;

  @Prop({ required: true, type: Array, enum: UserRole })
  roles: UserRole[];

  @Prop({ type: Array, enum: UserSigninBy })
  signinBy: UserSigninBy[];

  @Prop({ type: Boolean })
  country: string;

  @Prop({ type: String })
  profileImage: string;

  @Prop({ type: Object })
  sentMail: SentUserMailInterface;

  @Prop({ type: Object })
  binanceCredentials: CredentialsInterface<Exchanges.Binance>

  @Prop({ type: Object })
  bybitCredentials: CredentialsInterface<Exchanges.Bybit>

  @Prop({ type: Types.ObjectId, ref: 'Strategy' })
  strategys: Types.ObjectId[];

  @Prop({ type: Object })
  binanceBalence: BalenceInterface<Exchanges.Binance>

  @Prop({ type: String })
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
