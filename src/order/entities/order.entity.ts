import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ClosedByEnum } from '../enums/closedBy.enum';
import { CreatedByEnum } from '../enums/createdBy.enum';
import { StatusEnum } from '../enums/status.enum';

@Schema({ timestamps: true, versionKey: false })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Strategy', index: true })
  strategyId: Types.ObjectId;

  @Prop({ type: String, index: true })
  copyOrderId: string;

  @Prop({ type: String, index: true })
  binanceOrderId: string;

  @Prop({ type: String, required: true })
  createdBy: CreatedByEnum;

  @Prop({ type: Boolean, default: false })
  isRootOrder: boolean;

  @Prop({ type: String })
  closedBy: ClosedByEnum;

  @Prop({ type: Number })
  pnl: number;

  @Prop({ type: Number, required: true })
  entryPrice: number;

  @Prop({ type: Number, required: true })
  orderQty: number;

  @Prop({ type: Number, required: true })
  leverage: number;

  @Prop({ type: Boolean, required: true })
  isolated: boolean;

  @Prop({ type: String, required: true })
  status: StatusEnum

  @Prop({ type: String, required: true })
  closeReason: string;

  // @Prop({ type: Order, })
  // modifications: Order[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
