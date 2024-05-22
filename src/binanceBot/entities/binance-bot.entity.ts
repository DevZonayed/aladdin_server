import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class BinanceBot extends Document {

    @Prop({ type: String })
    strategyAccauntName: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    strategyAccaunt: Types.ObjectId;

    @Prop({ type: [String] })
    strategySlugs: string[];

    @Prop({ type: Boolean })
    isActive: boolean;

}

export const BinanceBotSchema =
    SchemaFactory.createForClass(BinanceBot);
