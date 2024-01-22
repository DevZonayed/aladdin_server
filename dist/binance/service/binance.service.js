"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const crypto = require("crypto");
const binance_constants_1 = require("../constants/binance.constants");
let BinanceService = class BinanceService {
    constructor() {
        this.BaseUrl = binance_constants_1.BINANCE_MODE === "dev" ? binance_constants_1.BINANCE_TEST_BASE_API_URL : binance_constants_1.BINANCE_BASE_API_URL;
    }
    async checkBalance(apiKey, secretKey) {
        const timestamp = new Date().getTime();
        const queryString = `timestamp=${timestamp}`;
        const signature = this.signatureGenerator(secretKey, queryString);
        const url = `${this.BaseUrl}/v3/account?${queryString}&signature=${signature}`;
        const options = {
            headers: {
                'X-MBX-APIKEY': apiKey,
            },
        };
        return await axios_1.default.get(url, options);
    }
    signatureGenerator(secretKey, queryString) {
        return crypto
            .createHmac('sha256', secretKey)
            .update(queryString)
            .digest('hex');
    }
};
exports.BinanceService = BinanceService;
exports.BinanceService = BinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], BinanceService);
//# sourceMappingURL=binance.service.js.map