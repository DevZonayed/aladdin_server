import { Types } from "mongoose"

export interface CreateBinanceStrategyOrderDto {
    strategyData: {
        _id: Types.ObjectId,
        capital: number,
        tradeMaxAmountPercentage: number,
        tradeMaxLeverage: number,
        bannedAssets: string[],
        allowAssets: string[],
    },
    credentials: {
        _id: Types.ObjectId,
        binanceCredentials: {
            apiKey: string,
            apiSecret: string
        }
    },
    order: {
        copyOrderId: string,
        symbol: string,
        side: string,
        type: string,
        quantity: number,
        price: number,
        leverage: number,
        isolated: boolean
    }
}