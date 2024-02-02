import { Model } from "mongoose";
import { SignalTypeEnum } from "src/binance/enum/BinanceEnum";
import { NotificationService } from "src/notification/mail/service/notification.service";
import { OrderSideEnum } from "src/order/enums/OrderSide.enum";
import { OrderWebHookDto } from "src/strategy/dto/order_webhook-dto";
import { StrategyService } from "src/strategy/service/strategy.service";
import { Bot } from "src/strategyBot/entities/bot.entity";
import { dummyOrderData } from "../data/dummySignal";
import { sendErrorNotificationToAdmins, sendInfoNotificationToAdmins, sendSuccessNotificationToAdmins } from "../utils/botMail.utils";
import { DataWatcher } from "./watcherService";
const axios = require("axios")


// Worker
export class ScrapWorker {
    public isWorking: boolean
    private dataWatcher: DataWatcher;
    private updateTime: number
    private errorMessage: string
    private scrapId: string
    private p20t: string
    private csrfToken: string
    private strName: string
    private updateTimerId: any
    private intervalId: any
    private tokenValidateTimerId: any
    private strategyService: StrategyService
    private botDto: Bot
    private BotModel: Model<Bot>
    private mailNotificationService: NotificationService
    private configData: any = {
        scrapInterval: 3000
    }


    constructor(strategyService: StrategyService, botDto, mailNotificationService: NotificationService, BotModel: Model<Bot>) {
        let { _id: id, BotName, strategyId, p20t, csrfToken } = botDto;
        Object.assign(this, { id: id.toString(), strName: BotName, scrapId: strategyId, p20t, csrfToken, strategyService, botDto, mailNotificationService, BotModel });
        this.isWorking = false;
        this.updateTime = Date.now();
        this.dataWatcher = new DataWatcher();
        this.errorMessage = null;
    }

    public getWorkerStatus() {
        let openOrders = this.dataWatcher.runningOrders()
        return {
            scrapId: this.scrapId,
            p20t: this.p20t,
            csrfToken: this.csrfToken,
            isWorking: this.isWorking,
            lastUpdate: new Date(this.updateTime).toLocaleString(),
            openOrders
        }
    }

    public updateWorkerProperty(key, value) {
        if (this.hasOwnProperty(key)) {
            this[key] = value;
            sendInfoNotificationToAdmins(this.mailNotificationService, `${key} Updated of "${this.strName}" Strategy`)
            return true;
        }
        return false;
    }

    // Check data update validity
    monitorMissedUpdates() {
        this.updateTimerId = setInterval(() => {
            if ((this.updateTime + 10000) <= Date.now() && this.isWorking) {
                this.isWorking = false;
                this.notifyTelegram(this.strName + " I have missed last 5 updates on this strategy.");
                if (this.errorMessage) {
                    this.notifyTelegram(`Error on "${this.strName}" Strategy: ${this.errorMessage}`);
                }
            }
        }, this.configData.scrapInterval * 5);
    }
    // Start the worker
    async startWorker() {
        try {
            // Check Token If needed
            if (!this.botDto.isPublic) {
                let result: any = await isValidToken(this.p20t, this.csrfToken)
                if (!result?.success) throw new Error("Something went wrong while checking Token")
                this.checkTokenValidity()
            }

            // Update to db
            await this.updateBotDb(this.botDto._id, { isRunning: true })

            this.isWorking = true;
            this.monitorMissedUpdates();
            if (!this.intervalId) {
                this.intervalId = setInterval(() => this.scrapAndUpdate(), this.configData.scrapInterval);
            }
            this.setupEventListeners();
            return true;

        } catch (err) {

            let isExpaired = err?.response?.data;
            if (isExpaired) {
                sendErrorNotificationToAdmins(this.mailNotificationService, "Token Expaired !❌❌\nPlease Update Token Immediately!")
                this.notifyTelegram("Token Expaired !❌❌\nPlease Update Token Immediately!")
                this.stopWorker();
            } else {
                this.notifyTelegram("Something Went Wrong!\nToken Validation Failed!")
            }

        }

    }

    async stopWorker() {
        clearInterval(this.intervalId);
        clearInterval(this.updateTimerId);
        clearInterval(this.tokenValidateTimerId);
        this.intervalId = this.updateTimerId = this.tokenValidateTimerId = null;
        this.isWorking = false;
        // Update to db
        await this.updateBotDb(this.botDto._id, { isRunning: false })
        return true;
    }

    organizeAndWatchData(row) {
        let data = row?.data || [];
        let openPositions = data.filter(res => +res.positionAmount !== 0);
        this.dataWatcher.updateData(openPositions);
    }

    processCopyTradeRequest({ scrapId, p20t, csrfToken }) {
        return new Promise((resolve, reject) => {
            const CancelToken = axios.CancelToken;
            let cancelPreviousRequest;

            const binanceApiUrl = `https://www.binance.com/bapi/futures/v1/friendly/future/copy-trade/lead-data/positions?portfolioId=${scrapId}`;
            const headers = {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'Clienttype': 'web',
                'Content-Type': 'application/json',
                'Cookie': `p20t=${p20t};`,
                'Csrftoken': `${csrfToken}`,
                'Referer': `https://www.binance.com/en/copy-trading/lead-details/${scrapId}`,
                'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            };

            if (cancelPreviousRequest) {
                cancelPreviousRequest('Cancelled due to new request');
                reject("Cancelled due to new request")
            }

            axios.get(binanceApiUrl, {
                headers: headers,
                cancelToken: new CancelToken(function executor(c) {
                    cancelPreviousRequest = c;
                })
            })
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    if (axios.isCancel(error)) {
                        reject('Previous request cancelled:' + error.message)
                    } else {
                        reject('There was an error!' + error.message)
                    }
                });
        })
    }

    checkTokenValidity() {
        this.tokenValidateTimerId = setInterval(() => {
            isValidToken(this.p20t, this.csrfToken, this.botDto.BotName).then(res => res).catch(err => {

                let isExpaired = err?.response?.data;
                if (isExpaired) {
                    let message = "Token Expaired !❌❌\nPlease Update Token Immediately!"
                    sendErrorNotificationToAdmins(this.mailNotificationService, message)
                    this.stopWorker();
                } else {
                    let message = "Something Went Wrong!\nToken Validation Failed!";
                    sendErrorNotificationToAdmins(this.mailNotificationService, message)
                }
            })
        }, this.configData.scrapInterval * 100)
    }

    setupEventListeners() {
        this.dataWatcher.on("newOrder", (order) => {
            this.handleCreateOrder(order)
        })
        // Close Order
        this.dataWatcher.on("removedOrder", (order) => {
            this.handleCloseOrder(order)
        })

        // Detact Change
        this.dataWatcher.on("updatedOrder", (prevOrder, currentOrder) => {
            this.handleUpdateOrder(prevOrder, currentOrder)
        })

        // Unusual Activity Detected
        // Close Order
        this.dataWatcher.on("unUsualActivity", async (order) => {
            this.stopWorker();
            this.notifyTelegram("Unusual Activity Detacted!\n token checking!")
            await isValidToken(this.p20t, this.csrfToken, this.botDto.BotName).then(res => {
                this.startWorker()
            }).catch(err => {
                let isExpaired = err?.response?.data;
                if (isExpaired) {
                    sendErrorNotificationToAdmins(this.mailNotificationService, "Token Expaired !❌❌\nPlease Update Token Immediately!")
                    this.notifyTelegram("Token Expaired !❌❌\nPlease Update Token Immediately!")
                } else {
                    this.startWorker()
                    this.notifyTelegram("Something Went Wrong!\nToken Validation Failed!")
                }
            })
        })
    }


    notifyTelegram(message) {
        // sendToChannel(this.telegramChannelId, message);
        console.log(message)
    }

    scrapAndUpdate() {
        // mockprocessCopyTradeRequest({ scrapId: this.scrapId, p20t: this.p20t, csrfToken: this.csrfToken })
        this.processCopyTradeRequest({ scrapId: this.scrapId, p20t: this.p20t, csrfToken: this.csrfToken })
            .then(res => {
                this.updateTime = Date.now();
                this.errorMessage = null;
                this.organizeAndWatchData(res);
            })
            .catch(err => {
                this.errorMessage = err.message;
                console.error(err);
            });
    }


    // Order data customize for hadge mode order
    handleHadgeOrderDto(order: any) {
        if (order.positionSide.toUpperCase() != OrderSideEnum.BOTH) {
            return order;
        }
        let orderAmount = parseFloat(order.positionAmount);
        let positionSide = orderAmount > 0 ? OrderSideEnum.LONG : OrderSideEnum.SHORT;
        let positionAmount = Math.abs(orderAmount);

        let updatedOrder = {
            ...order,
            positionAmount,
            positionSide,
        }
        return updatedOrder;
    }

    // Events
    // Order Creations
    async handleCreateOrder(order: any) {
        try {
            order = this.handleHadgeOrderDto(order)
            let strategyService: StrategyService = this.strategyService;
            let botName = this.botDto.BotName
            let botSlag = this.botDto.strategySlug
            let orderPayload: OrderWebHookDto = {
                copyOrderId: `${botName}-${order.id}`,
                isolated: Boolean(order.isolated),
                leverage: Number(order.leverage),
                price: Number(order.entryPrice),
                quantity: Math.abs(Number(order.positionAmount)),
                side: order.positionSide.toUpperCase(),
                signalType: SignalTypeEnum.NEW,
                symbol: order.symbol,
                type: "LIMIT"
            }
            let result: any = await strategyService.handleWebHook(botSlag, orderPayload)
            let message = `New Order Created for ${order.symbol} with ${order.positionAmount} quantity`
            if (typeof result.payload == "string") {
                message += `\n but something went wrong, it returns: ${result.payload}`
            }
            sendSuccessNotificationToAdmins(this.mailNotificationService, message)

        } catch (err) {
            console.error(`Error Occured on order creation in ${this.botDto.BotName} Bot!`, err);
            let message = `Order Create for ${this.botDto.BotName} Bot Error : ${err.message}`
            sendErrorNotificationToAdmins(this.mailNotificationService, message)
        }
    }

    // Order Update
    async handleUpdateOrder(prevOrder, newOrder) {
        try {
            prevOrder = this.handleHadgeOrderDto(prevOrder)
            newOrder = this.handleHadgeOrderDto(newOrder)

            let differences = [];
            let includedKeys = ["positionAmount"]
            Object.keys(prevOrder).forEach(key => {
                if (includedKeys.includes(key)) {
                    if (prevOrder[key] !== newOrder[key]) {
                        differences.push({
                            key: key,
                            previousValue: prevOrder[key],
                            currentValue: newOrder[key] === undefined ? "Key not present in New Update" : newOrder[key]
                        });
                    }
                }
            });

            if (differences.length == 0) return;

            let diffrence = differences[0]
            if (diffrence.key != "positionAmount") {
                return
            }

            let orderQty = Number(diffrence.currentValue) - Number(diffrence.previousValue);
            let OrderType = orderQty > 0 ? SignalTypeEnum.RE_ENTRY : SignalTypeEnum.PARTIAL_CLOSE
            // Order Procidure
            let strategyService: StrategyService = this.strategyService;
            let botName = this.botDto.BotName
            let botSlag = this.botDto.strategySlug
            let order = newOrder;
            let orderPayload: OrderWebHookDto = {
                copyOrderId: `${botName}-${order.id}`,
                isolated: Boolean(order.isolated),
                leverage: Number(order.leverage),
                price: Number(order.entryPrice),
                quantity: Math.abs(Number(orderQty)),
                side: order.positionSide.toUpperCase(),
                signalType: OrderType,
                symbol: order.symbol,
                type: "MARKET"
            }
            let result: any = await strategyService.handleWebHook(botSlag, orderPayload)

            let message = `Order Updated for ${order.symbol} with ${order.positionAmount} quantity`;
            if (typeof result.payload == "string") {
                message += `\n but something went wrong, it returns: ${result.payload}`
            }
            sendSuccessNotificationToAdmins(this.mailNotificationService, message)
        } catch (err) {
            console.error(`Error Occured on order update in ${this.botDto.BotName} Bot!`, err);
            let message = `Order Update for ${this.botDto.BotName} Bot Error : ${err.message}`
            sendErrorNotificationToAdmins(this.mailNotificationService, message)
        }
    }

    // Order Close
    async handleCloseOrder(order: any) {
        try {
            order = this.handleHadgeOrderDto(order);
            let strategyService: StrategyService = this.strategyService
            let botName = this.botDto.BotName
            let botSlag = this.botDto.strategySlug
            let orderPayload: OrderWebHookDto = {
                copyOrderId: `${botName}-${order.id}`,
                isolated: Boolean(order.isolated),
                leverage: Number(order.leverage),
                price: Number(order.entryPrice),
                quantity: Math.abs(Number(order.positionAmount)),
                side: order.positionSide.toUpperCase(),
                signalType: SignalTypeEnum.PARTIAL_CLOSE,
                symbol: order.symbol,
                type: "MARKET"
            }
            let result: any = await strategyService.handleWebHook(botSlag, orderPayload)
            let message = `Order Closed for ${order.symbol} with ${order.positionAmount} quantity`
            if (typeof result.payload == "string") {
                message += `\n but something went wrong, it returns: ${result.payload}`
            }
            sendSuccessNotificationToAdmins(this.mailNotificationService, message)
        } catch (err) {
            console.error(`Error Occured on order close in ${this.botDto.BotName} Bot!`, err);
            let message = `Order Closed for ${order.symbol} Error : ${err.message}`
            sendErrorNotificationToAdmins(this.mailNotificationService, message)
        }
    }

    // Database Updateation
    async updateBotDb(id: string, payload: any) {
        try {
            await this.BotModel.updateOne({ _id: id }, payload)
        } catch (err) {
            let message = `Error Occured while updating ${this.botDto.BotName} bot in database Error:\n${err.message}`
            sendErrorNotificationToAdmins(this.mailNotificationService, message)
        }
    }
}




// Validate token
async function isValidToken(p20t, csrfToken, channelId = null) {
    const requestData = (attempt = 1) => {
        return new Promise((resolve, reject) => {
            let data = JSON.stringify({});
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://www.binance.com/bapi/accounts/v1/private/account/user/base-detail',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                    'Referer': 'https://www.binance.com/en/my/dashboard',
                    'Cookie': `p20t=${p20t}`,
                    'Csrftoken': csrfToken,
                    'Content-Type': 'application/json',
                    'Clienttype': 'web',
                    'Accept-Language': 'en-US,en;q=0.9'
                },
                data: data
            };
            axios.request(config)
                .then(response => resolve(response.data))
                .catch(async error => {
                    if (error?.response?.data?.code === '100002001') {
                        reject(error);
                    } else if (attempt < 10) {
                        requestData(attempt + 1).then(resolve).catch(reject);
                    } else {
                        reject(error);
                    }
                });
        });
    };

    return requestData();
}



// Mock Function
let index = 0;
function mockprocessCopyTradeRequest(...arg) {
    return new Promise(resolve => {
        let currentRes = dummyOrderData[index]
        index++
        resolve({
            data: currentRes
        })
    })
}