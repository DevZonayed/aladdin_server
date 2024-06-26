import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MaxPosition, MaxPositionEntity } from '../interfaces/max_position.interface';

@Schema({ timestamps: true, versionKey: false })
export class Strategy extends Document {
  @Prop({ type: String, required: true, unique: true })
  StrategyName: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [String] })
  bannedAssets: string[]

  @Prop({ type: [String] })
  allowAssets: string[]

  @Prop({ type: String, unique: true, required: true, index: true })
  apiSlug: string

  @Prop({ type: Number, required: true })
  capital: number

  @Prop({ type: String, required: true, uppercase: true, enum: ['MARKET', 'LIMIT'] })
  newOrderType: string

  @Prop({ type: String, required: true, uppercase: true, enum: ['MARKET', 'LIMIT'] })
  partialOrderType: string

  @Prop({ type: Boolean, required: true, default: false })
  isolated: Boolean

  @Prop({ type: Number, required: true })
  minimumCapitalToSubscribe: number

  @Prop({ type: Number, required: true })
  tradeMaxAmountPercentage: number

  @Prop({ type: Boolean, default: false })
  respectNotion: boolean

  @Prop({ type: Number, required: true })
  tradeMaxLeverage: number

  @Prop({ type: Boolean, default: true })
  reEntry: boolean

  @Prop({ type: Boolean, default: false })
  stopLoss: boolean

  @Prop({ type: Number, default: 100, min: 1, max: 100 })
  stopLossPercentage: number

  @Prop({ type: Types.ObjectId, ref: 'User' })
  users: Types.ObjectId[];

  @Prop({ type: Boolean, default: false })
  isRunning: boolean;

  @Prop({ type: MaxPositionEntity, default: { includeOpen: false, max: 10 } })
  maxPosition: MaxPosition;

  @Prop({ type: Boolean, default: false })
  stopNewOrder: boolean;


  @Prop({ type: Number, default: 2 })
  maxLongPosition: number;

  @Prop({ type: Number, default: 2 })
  maxShortPosition: number;

  @Prop({ type: String, default: "BOTH", enum: ['BUY', 'SELL', 'BOTH'] })
  prefaredSignalType: string;

  @Prop({ type: Number, default: 3 })
  maxReEntry: number;

  @Prop({ type: Date })
  startAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const StrategySchema =
  SchemaFactory.createForClass(Strategy);
