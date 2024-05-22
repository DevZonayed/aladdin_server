import axios from "axios";
import WebSocket from 'ws';
import { BinanceBot } from "../entities/binance-bot.entity";

export class BinanceBotConnection {
    private readonly binanceListenKeyHook: string = "https://testnet.binancefuture.com/fapi/v1/listenKey";
    private listenKey: string;
    private status: boolean = false;
    private ws: WebSocket | null = null;

    constructor(private apiKey: string, private apiSecret: string, private strategy: BinanceBot) { }

    async getListenKey() {
        try {
            const response = await axios.post(this.binanceListenKeyHook, {}, {
                headers: {
                    "X-MBX-APIKEY": this.apiKey
                }
            });
            if (response.data.listenKey) {
                this.listenKey = response.data.listenKey;
            } else {
                throw new Error("No listen key found");
            }
        } catch (err) {
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

                    const intervalTime = 30 * 60 * 1000; // 30 minutes
                    await new Promise(resolve => setTimeout(resolve, intervalTime));

                    if (this.status) {
                        await this.getListenKey();
                        this.handleAccountOrder(this.listenKey);
                    }
                }
            }
        } catch (err) {
            console.error("Error in start method:", err.message);
        }
    }

    handleAccountOrder(listenKey: string) {
        if (this.ws) {
            this.ws.close();
        }

        this.ws = new WebSocket(`wss://stream.binancefuture.com/ws/${listenKey}`);

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

    private handleMessage(data: WebSocket.Data) {
        // Implement message handling logic here
        console.log("Message received:", data);
    }
}
