import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Bot extends Document {
  @Prop({ type: String, required: true, unique: true })
  BotName: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String, required: true })
  strategySlug: string;

  @Prop({ type: String, required: true, trim: true })
  strategyId: string;

  @Prop({ type: String, required: true, trim: true })
  p20t: string;

  @Prop({ type: String, required: true, trim: true })
  csrfToken: string;

  @Prop({ type: Number, required: true, trim: true, default: 5000 })
  scrapInterval: number;

  @Prop({ type: Boolean, default: false })
  isPublic: boolean

  @Prop({ type: Number, default: false })
  runningOrders: number

  @Prop({ type: Boolean, default: false })
  isRunning: boolean;

  @Prop({ type: Boolean, default: false })
  haveProxy: boolean;

  @Prop({ type: String, default: false })
  proxyUrl: string;

  @Prop({ type: Date })
  startAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const BotSchema =
  SchemaFactory.createForClass(Bot);
