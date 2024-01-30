import { SignalTypeEnum } from "src/binance/enum/BinanceEnum";
import { MailNotificationTypeEnum } from "src/notification/mail/enum/mail.type.enum";
import { NotificationService } from "src/notification/mail/service/notification.service";
import { OrderWebHookDto } from "src/strategy/dto/order_webhook-dto";
import { StrategyService } from "src/strategy/service/strategy.service";
import { Bot } from "src/strategyBot/entities/bot.entity";
import { DataWatcher } from "./watcherService";
const axios = require("axios")


// Worker
export class ScrapWorker {
    dataWatcher: DataWatcher;
    updateTime: number
    isWorking: boolean
    errorMessage: string
    scrapId: string
    p20t: string
    csrfToken: string
    strName: string
    updateTimerId: any
    intervalId: any
    tokenValidateTimerId: any
    strategyService: StrategyService
    botDto: Bot
    mailNotificationService: NotificationService
    configData: any = {
        scrapInterval: 3000
    }


    constructor(strategyService: StrategyService, botDto, mailNotificationService: NotificationService) {
        let { _id, BotName, strategyId, p20t, csrfToken } = botDto;
        Object.assign(this, { id: _id, strName: BotName, scrapId: strategyId, p20t, csrfToken, strategyService, botDto, mailNotificationService });
        this.isWorking = false;
        this.updateTime = Date.now();
        this.dataWatcher = new DataWatcher();
        this.errorMessage = null;

        this.notifyTelegram(`A Strategy Created Called ${this.strName}`);
    }

    getAllData() {
        return {
            scrapId: this.scrapId,
            p20t: this.p20t,
            csrfToken: this.csrfToken,
            isWorking: this.isWorking,
            lastUpdate: new Date(this.updateTime).toLocaleString()
        }
    }

    updateProperty(key, value) {
        if (this.hasOwnProperty(key)) {
            this[key] = value;
            this.notifyTelegram(`${key} Updated of "${this.strName}" Strategy`);
            return true;
        }
        return false;
    }

    isCompleteScrapWorker() {
        const requiredProps = ['id', 'scrapId', 'p20t', 'csrfToken',];
        return requiredProps.every(prop => this[prop]);
    }

    // Check data update validity
    checkUpdates() {
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
    startScrapWorker() {
        if (!this.isCompleteScrapWorker()) return false;
        this.notifyTelegram(this.strName + " Strategy token checking...");
        isValidToken(this.p20t, this.csrfToken)
            .then(res => {
                this.notifyTelegram(this.strName + " Strategy is Started!");
                this.isWorking = true;
                this.checkUpdates();
                if (!this.intervalId) {
                    this.intervalId = setInterval(() => this.scrapAndUpdate(), this.configData.scrapInterval);
                }
                this.handleEvents();
                return true;
            })
            .catch(err => {
                let isExpaired = err?.response?.data;
                if (isExpaired) {
                    this.notifyTelegram("Token Expaired !❌❌\nPlease Update Token Immediately!")
                    this.stopScrapWorker();
                } else {
                    this.notifyTelegram("Something Went Wrong!\nToken Validation Failed!")
                }
            })

    }

    stopScrapWorker() {
        clearInterval(this.intervalId);
        clearInterval(this.updateTimerId);
        clearInterval(this.tokenValidateTimerId);
        this.intervalId = this.updateTimerId = this.tokenValidateTimerId = null;
        this.notifyTelegram(this.strName + " Strategy is Stopped!");
        this.isWorking = false;
        return true;
    }

    orgData(row) {
        let data = row?.data || [];
        let openPositions = data.filter(res => +res.positionAmount !== 0);
        this.dataWatcher.updateData(openPositions);
    }

    handleCopyTradeRequest({ scrapId, p20t, csrfToken }) {
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
            isValidToken(this.p20t, this.csrfToken).then(res => res).catch(err => {
                let isExpaired = err?.response?.data;
                if (isExpaired) {
                    this.notifyTelegram("Token Expaired !❌❌\nPlease Update Token Immediately!")
                    this.stopScrapWorker();
                } else {
                    this.notifyTelegram("Something Went Wrong!\nToken Validation Failed!")
                }
            })
        }, this.configData.scrapInterval * 100)
    }

    handleEvents() {
        this.dataWatcher.on("newOrder", (order) => {
            handleCreateOrder(order, this, this.botDto)
        })
        // Close Order
        this.dataWatcher.on("removedOrder", (order) => {
            handleCloseOrder(order, this, this.botDto)
        })

        // Detact Change
        this.dataWatcher.on("updatedOrder", (prevOrder, currentOrder) => {
            handleUpdateOrder(prevOrder, currentOrder, this, this.botDto)
        })

        // Unusual Activity Detected
        // Close Order
        this.dataWatcher.on("unUsualActivity", (order) => {
            this.stopScrapWorker();
            this.notifyTelegram("Unusual Activity Detacted!\n token checking!")
            isValidToken(this.p20t, this.csrfToken,).then(res => {
                this.startScrapWorker()
            }).catch(err => {
                let isExpaired = err?.response?.data;
                if (isExpaired) {
                    this.notifyTelegram("Token Expaired !❌❌\nPlease Update Token Immediately!")
                } else {
                    this.startScrapWorker()
                    this.notifyTelegram("Something Went Wrong!\nToken Validation Failed!")
                }
            })
        })
    }


    notifyTelegram(message) {
        // sendToChannel(this.telegramChannelId, message);
    }

    scrapAndUpdate() {
        this.handleCopyTradeRequest({ scrapId: this.scrapId, p20t: this.p20t, csrfToken: this.csrfToken })
            .then(res => {
                this.updateTime = Date.now();
                this.errorMessage = null;
                this.orgData(res);
            })
            .catch(err => {
                this.errorMessage = err.message;
                console.error(err);
            });
    }
}




// Handle Order Create
async function handleCreateOrder(order: any, Instace: ScrapWorker, botDto: Bot) {
    try {
        let strategyService: StrategyService = Instace.strategyService;
        let botName = botDto.BotName
        let botSlag = botDto.strategySlug
        let orderPayload: OrderWebHookDto = {
            copyOrderId: `${botName}-${order.id}`,
            isolated: Boolean(order.isolated),
            leverage: order.leverage,
            price: order.entryPrice,
            quantity: order.positionAmount,
            side: order.positionSide.toUpperCase(),
            signalType: SignalTypeEnum.NEW,
            symbol: order.symbol,
            type: "LIMIT"
        }
        await strategyService.handleWebHook(botSlag, orderPayload)
        await Instace.mailNotificationService.sendNotificationToAllAdmins({
            subject: "New Order Created",
            message: `New Order Created for ${order.symbol} with ${order.positionAmount} quantity`,
            type: MailNotificationTypeEnum.SUCCESS,
        })

    } catch (err) {
        console.error(`Error Occured on order creation in ${botDto.BotName} Bot!`, err);
        await Instace.mailNotificationService.sendNotificationToAllAdmins({
            subject: "Order Create Error",
            message: `Order Create for ${botDto.BotName} Bot Error : ${err.message}`,
            type: MailNotificationTypeEnum.ERROR,
        })
    }
}

// Handle Update Orders
async function handleUpdateOrder(prevOrder, newOrder, Instace, botDto: Bot) {
    try {

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
        let strategyService: StrategyService = Instace.strategyService;
        let botName = botDto.BotName
        let botSlag = botDto.strategySlug
        let order = newOrder;
        let orderPayload: OrderWebHookDto = {
            copyOrderId: `${botName}-${order.id}`,
            isolated: Boolean(order.isolated),
            leverage: order.leverage,
            price: order.entryPrice,
            quantity: Math.abs(orderQty),
            side: order.positionSide.toUpperCase(),
            signalType: OrderType,
            symbol: order.symbol,
            type: "MARKET"
        }
        await strategyService.handleWebHook(botSlag, orderPayload)
        await Instace.mailNotificationService.sendNotificationToAllAdmins({
            subject: "Order Updated",
            message: `Order Updated for ${order.symbol} with ${order.positionAmount} quantity`,
            type: MailNotificationTypeEnum.SUCCESS,
        })
    } catch (err) {
        console.error(`Error Occured on order update in ${botDto.BotName} Bot!`, err);
        await Instace.mailNotificationService.sendNotificationToAllAdmins({
            subject: "Order Update Error",
            message: `Order Update for ${botDto.BotName} Bot Error : ${err.message}`,
            type: MailNotificationTypeEnum.ERROR,
        })
    }


}

// Handle Order Close
async function handleCloseOrder(order: any, Instace: ScrapWorker, botDto: Bot) {
    try {
        let strategyService: StrategyService = Instace.strategyService
        let botName = botDto.BotName
        let botSlag = botDto.strategySlug
        let orderPayload: OrderWebHookDto = {
            copyOrderId: `${botName}-${order.id}`,
            isolated: Boolean(order.isolated),
            leverage: order.leverage,
            price: order.entryPrice,
            quantity: order.positionAmount,
            side: order.positionSide.toUpperCase(),
            signalType: SignalTypeEnum.PARTIAL_CLOSE,
            symbol: order.symbol,
            type: "MARKET"
        }
        await strategyService.handleWebHook(botSlag, orderPayload)
        await Instace.mailNotificationService.sendNotificationToAllAdmins({
            subject: "Order Closed",
            message: `Order Closed for ${order.symbol} with ${order.positionAmount} quantity`,
            type: MailNotificationTypeEnum.SUCCESS,
        })
    } catch (err) {
        console.error(`Error Occured on order close in ${botDto.BotName} Bot!`, err);
        await Instace.mailNotificationService.sendNotificationToAllAdmins({
            subject: "Order Closed Error",
            message: `Order Closed for ${order.symbol} Error : ${err.message}`,
            type: MailNotificationTypeEnum.ERROR,
        })
    }
}


// Validate token
function isValidToken(p20t, csrfToken, channelId = null) {
    const requestData = (attempt = 1) => {
        return new Promise((resolve, reject) => {
            let data = JSON.stringify({
                "strategyName": "SiderealWP",
                "p20t": p20t,
                "csrfToken": csrfToken
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://www.binance.com/bapi/accounts/v1/private/account/user/base-detail',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                    'Referer': 'https://www.binance.com/en/my/dashboard',
                    'Csrftoken': csrfToken,
                    'Cookie': `p20t=${p20t}`,
                    'Content-Type': 'application/json',
                    'Clienttype': 'web',
                    'Accept-Language': 'en-US,en;q=0.9'
                },
                data: data
            };

            axios.request(config)
                .then(response => resolve(response.data))
                .catch(error => {
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