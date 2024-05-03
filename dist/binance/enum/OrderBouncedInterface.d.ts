import { Order } from "src/order/entities/order.entity";
import { Strategy } from "src/strategy/entities/strategy.entity";
import { SignalTypeEnum } from "./BinanceEnum";
export interface OrderBouncedPayloadInterface {
    prevOrderRes: Order;
    signalType: SignalTypeEnum;
    strategy: Strategy;
    side: string;
    openPositionCount: number;
    allOpenOrdersRes: Order[];
    maxLongEntry: number;
    maxShortEntry: number;
    symbol: string;
}
