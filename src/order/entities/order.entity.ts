import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderSideEnum } from '../enums/OrderSide.enum';
import { ClosedByEnum } from '../enums/closedBy.enum';
import { CreatedByEnum } from '../enums/createdBy.enum';
import { OrderTypeEnum } from '../enums/orderType.enum';
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

  @Prop({ type: String, default: false })
  symbol: string;

  @Prop({ type: Boolean, default: false })
  isRootOrder: boolean;

  @Prop({ type: String, default: false })
  type: OrderTypeEnum;

  @Prop({ type: String, default: false })
  side: OrderSideEnum;

  @Prop({ type: String })
  closedBy: ClosedByEnum;

  @Prop({ type: Number, required: true })
  entryPrice: number;

  @Prop({ type: Number, required: true })
  orderQty: number;

  @Prop({ type: Number, default: 0 })
  closedQty: number;

  @Prop({ type: Number, required: true })
  leverage: number;

  @Prop({ type: Number, })
  initialOrderRatio: number;

  @Prop({ type: Boolean, required: true })
  isolated: boolean;

  @Prop({ type: String, required: true, default: StatusEnum.OPEN })
  status: StatusEnum

  @Prop({ type: String, })
  closeReason: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
