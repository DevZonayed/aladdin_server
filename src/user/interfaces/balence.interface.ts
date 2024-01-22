import { Exchanges } from "src/common/enum/enum-exchanges";

export interface BalenceInterface<T extends Exchanges> {
    balence: number;
    lastUpdate: Date;
    exchange: T;
}
