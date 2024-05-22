"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceBotConnection = void 0;
const axios_1 = require("axios");
const ws_1 = require("ws");
class BinanceBotConnection {
    constructor(apiKey, apiSecret, strategy) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.strategy = strategy;
        this.binanceListenKeyHook = "https://testnet.binancefuture.com/fapi/v1/listenKey";
        this.status = false;
        this.ws = null;
    }
    async getListenKey() {
        try {
            const response = await axios_1.default.post(this.binanceListenKeyHook, {}, {
                headers: {
                    "X-MBX-APIKEY": this.apiKey
                }
            });
            if (response.data.listenKey) {
                this.listenKey = response.data.listenKey;
            }
            else {
                throw new Error("No listen key found");
            }
        }
        catch (err) {
            console.error("Error fetching listen key:", err.message);
            throw new Error(err.message);
        }
    }
    async start() {
        try {
            if (!this.listenKey) {
                await this.getListenKey();
            }
            if (this.listenKey) {
                this.status = true;
                while (this.status) {
                    this.handleAccountOrder(this.listenKey);
                    const intervalTime = 30 * 60 * 1000;
                    await new Promise(resolve => setTimeout(resolve, intervalTime));
                    if (this.status) {
                        await this.getListenKey();
                        this.handleAccountOrder(this.listenKey);
                    }
                }
            }
        }
        catch (err) {
            console.error("Error in start method:", err.message);
        }
    }
    handleAccountOrder(listenKey) {
        if (this.ws) {
            this.ws.close();
        }
        this.ws = new ws_1.default(`wss://stream.binancefuture.com/ws/${listenKey}`);
        this.ws.on("open", () => {
            console.log("Binance websocket connected");
        });
        this.ws.on("close", () => {
            console.log("Binance websocket disconnected");
            if (this.status) {
                this.handleAccountOrder(this.listenKey);
            }
        });
        this.ws.on("message", this.handleMessage.bind(this));
    }
    async stop() {
        this.status = false;
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
    getStatus() {
        return this.status;
    }
    getName() {
        return this.strategy.strategyAccauntName;
    }
    handleMessage(data) {
        console.log("Message received:", data);
    }
}
exports.BinanceBotConnection = BinanceBotConnection;
//# sourceMappingURL=binance-bot-connection.service.js.map