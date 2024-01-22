import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { BINANCE_BASE_API_URL, BINANCE_MODE, BINANCE_TEST_BASE_API_URL } from '../constants/binance.constants';

@Injectable()
export class BinanceService {
    BaseUrl: string
    constructor() {
        this.BaseUrl = BINANCE_MODE === "dev" ? BINANCE_TEST_BASE_API_URL : BINANCE_BASE_API_URL;
    }

    async checkBalance(apiKey: string, secretKey: string) {
        const timestamp = new Date().getTime();
        const queryString = `timestamp=${timestamp}`;
        const signature = this.signatureGenerator(secretKey, queryString);
        const url = `${this.BaseUrl}/v3/account?${queryString}&signature=${signature}`;
        const options = {
            headers: {
                'X-MBX-APIKEY': apiKey,
            },
        };
        return await axios.get(url, options);
    }

    private signatureGenerator(secretKey: string, queryString: string) {
        return crypto
            .createHmac('sha256', secretKey)
            .update(queryString)
            .digest('hex');
    }
}
