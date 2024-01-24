import { Injectable } from '@nestjs/common';
import BinanceType from 'node-binance-api';
import { INVALID_BINANCE_CREDENTIALS } from 'src/common/constants';
const Binance = require('node-binance-api');


@Injectable()
export class BinanceService {

    async checkBalance(apiKey: string, secretKey: string) {
        return await this.binanceApiHandler(apiKey, secretKey, async (binance) => {
            let balances = await binance.futuresBalance();
            if (balances.code || Array.isArray(balances)) {
                throw new Error(balances.msg);
            }
            let usdtBalance = balances?.filter((b) => b?.asset === "USDT")[0];
            return usdtBalance ? usdtBalance.balance : 0;
        });
    }



    async binanceApiHandler(apiKey: string, secretKey: string, action: (binance: BinanceType) => Promise<any>) {
        if (!apiKey || !secretKey) {
            throw new Error(INVALID_BINANCE_CREDENTIALS);
        }
        let binance = null;
        try {
            binance = new Binance();
            binance.options({
                APIKEY: apiKey,
                APISECRET: secretKey
            });
            return await action(binance);
        } catch (err) {
            throw err;
        } finally {
            binance = null;
        }
    }



}
