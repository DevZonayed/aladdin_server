"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapWorker = void 0;
const BinanceEnum_1 = require("../../../binance/enum/BinanceEnum");
const dummySignal_1 = require("../data/dummySignal");
const botMail_utils_1 = require("../utils/botMail.utils");
const watcherService_1 = require("./watcherService");
const axios = require("axios");
class ScrapWorker {
    constructor(strategyService, botDto, mailNotificationService, BotModel) {
        this.configData = {
            scrapInterval: 3000
        };
        let { _id: id, BotName, strategyId, p20t, csrfToken } = botDto;
        Object.assign(this, { id: id.toString(), strName: BotName, scrapId: strategyId, p20t, csrfToken, strategyService, botDto, mailNotificationService, BotModel });
        this.isWorking = false;
        this.updateTime = Date.now();
        this.dataWatcher = new watcherService_1.DataWatcher();
        this.errorMessage = null;
    }
    getWorkerStatus() {
        let openOrders = this.dataWatcher.runningOrders();
        return {
            scrapId: this.scrapId,
            p20t: this.p20t,
            csrfToken: this.csrfToken,
            isWorking: this.isWorking,
            lastUpdate: new Date(this.updateTime).toLocaleString(),
            openOrders
        };
    }
    updateWorkerProperty(key, value) {
        if (this.hasOwnProperty(key)) {
            this[key] = value;
            (0, botMail_utils_1.sendInfoNotificationToAdmins)(this.mailNotificationService, `${key} Updated of "${this.strName}" Strategy`);
            return true;
        }
        return false;
    }
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
    async startWorker() {
        try {
            if (!this.botDto.isPublic) {
                let result = await isValidToken(this.p20t, this.csrfToken);
                if (!result?.success)
                    throw new Error("Something went wrong while checking Token");
                this.checkTokenValidity();
            }
            await this.updateBotDb(this.botDto._id, { isRunning: true });
            this.isWorking = true;
            this.monitorMissedUpdates();
            if (!this.intervalId) {
                this.intervalId = setInterval(() => this.scrapAndUpdate(), this.configData.scrapInterval);
            }
            this.setupEventListeners();
            return true;
        }
        catch (err) {
            let isExpaired = err?.response?.data;
            if (isExpaired) {
                (0, botMail_utils_1.sendErrorNotificationToAdmins)(this.mailNotificationService, "Token Expaired !❌❌\nPlease Update Token Immediately!");
                this.notifyTelegram("Token Expaired !❌❌\nPlease Update Token Immediately!");
                this.stopWorker();
            }
            else {
                this.notifyTelegram("Something Went Wrong!\nToken Validation Failed!");
            }
        }
    }
    async stopWorker() {
        clearInterval(this.intervalId);
        clearInterval(this.updateTimerId);
        clearInterval(this.tokenValidateTimerId);
        this.intervalId = this.updateTimerId = this.tokenValidateTimerId = null;
        this.isWorking = false;
        await this.updateBotDb(this.botDto._id, { isRunning: false });
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
                reject("Cancelled due to new request");
            }
            axios.get(binanceApiUrl, {
                headers: headers,
                cancelToken: new CancelToken(function executor(c) {
                    cancelPreviousRequest = c;
                })
            })
                .then(response => {
                resolve(response.data);
            })
                .catch(error => {
                if (axios.isCancel(error)) {
                    reject('Previous request cancelled:' + error.message);
                }
                else {
                    reject('There was an error!' + error.message);
                }
            });
        });
    }
    checkTokenValidity() {
        this.tokenValidateTimerId = setInterval(() => {
            isValidToken(this.p20t, this.csrfToken, this.botDto.BotName).then(res => res).catch(err => {
                let isExpaired = err?.response?.data;
                if (isExpaired) {
                    let message = "Token Expaired !❌❌\nPlease Update Token Immediately!";
                    (0, botMail_utils_1.sendErrorNotificationToAdmins)(this.mailNotificationService, message);
                    this.stopWorker();
                }
                else {
                    let message = "Something Went Wrong!\nToken Validation Failed!";
                    (0, botMail_utils_1.sendErrorNotificationToAdmins)(this.mailNotificationService, message);
                }
            });
        }, this.configData.scrapInterval * 100);
    }
    setupEventListeners() {
        this.dataWatcher.on("newOrder", (order) => {
            this.handleCreateOrder(order);
        });
        this.dataWatcher.on("removedOrder", (order) => {
            this.handleCloseOrder(order);
        });
        this.dataWatcher.on("updatedOrder", (prevOrder, currentOrder) => {
            this.handleUpdateOrder(prevOrder, currentOrder);
        });
        this.dataWatcher.on("unUsualActivity", async (order) => {
            this.stopWorker();
            this.notifyTelegram("Unusual Activity Detacted!\n token checking!");
            await isValidToken(this.p20t, this.csrfToken, this.botDto.BotName).then(res => {
                this.startWorker();
            }).catch(err => {
                let isExpaired = err?.response?.data;
                if (isExpaired) {
                    (0, botMail_utils_1.sendErrorNotificationToAdmins)(this.mailNotificationService, "Token Expaired !❌❌\nPlease Update Token Immediately!");
                    this.notifyTelegram("Token Expaired !❌❌\nPlease Update Token Immediately!");
                }
                else {
                    this.startWorker();
                    this.notifyTelegram("Something Went Wrong!\nToken Validation Failed!");
                }
            });
        });
    }
    notifyTelegram(message) {
        console.log(message);
    }
    scrapAndUpdate() {
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
    async handleCreateOrder(order) {
        try {
            let strategyService = this.strategyService;
            let botName = this.botDto.BotName;
            let botSlag = this.botDto.strategySlug;
            let orderPayload = {
                copyOrderId: `${botName}-${order.id}`,
                isolated: Boolean(order.isolated),
                leverage: Number(order.leverage),
                price: Number(order.entryPrice),
                quantity: Math.abs(Number(order.positionAmount)),
                side: order.positionSide.toUpperCase(),
                signalType: BinanceEnum_1.SignalTypeEnum.NEW,
                symbol: order.symbol,
                type: "LIMIT"
            };
            console.log("New Order In Event recived!");
            let result = await strategyService.handleWebHook(botSlag, orderPayload);
            let message = `New Order Created for ${order.symbol} with ${order.positionAmount} quantity`;
            if (typeof result.payload == "string") {
                message += `\n but something went wrong, it returns: ${result.payload}`;
            }
            (0, botMail_utils_1.sendSuccessNotificationToAdmins)(this.mailNotificationService, message);
        }
        catch (err) {
            console.error(`Error Occured on order creation in ${this.botDto.BotName} Bot!`, err);
            let message = `Order Create for ${this.botDto.BotName} Bot Error : ${err.message}`;
            (0, botMail_utils_1.sendErrorNotificationToAdmins)(this.mailNotificationService, message);
        }
    }
    async handleUpdateOrder(prevOrder, newOrder) {
        try {
            let differences = [];
            let includedKeys = ["positionAmount"];
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
            if (differences.length == 0)
                return;
            let diffrence = differences[0];
            if (diffrence.key != "positionAmount") {
                return;
            }
            let orderQty = Number(diffrence.currentValue) - Number(diffrence.previousValue);
            let OrderType = orderQty > 0 ? BinanceEnum_1.SignalTypeEnum.RE_ENTRY : BinanceEnum_1.SignalTypeEnum.PARTIAL_CLOSE;
            let strategyService = this.strategyService;
            let botName = this.botDto.BotName;
            let botSlag = this.botDto.strategySlug;
            let order = newOrder;
            let orderPayload = {
                copyOrderId: `${botName}-${order.id}`,
                isolated: Boolean(order.isolated),
                leverage: Number(order.leverage),
                price: Number(order.entryPrice),
                quantity: Math.abs(Number(orderQty)),
                side: order.positionSide.toUpperCase(),
                signalType: OrderType,
                symbol: order.symbol,
                type: "MARKET"
            };
            let result = await strategyService.handleWebHook(botSlag, orderPayload);
            let message = `Order Updated for ${order.symbol} with ${order.positionAmount} quantity`;
            if (typeof result.payload == "string") {
                message += `\n but something went wrong, it returns: ${result.payload}`;
            }
            (0, botMail_utils_1.sendSuccessNotificationToAdmins)(this.mailNotificationService, message);
        }
        catch (err) {
            console.error(`Error Occured on order update in ${this.botDto.BotName} Bot!`, err);
            let message = `Order Update for ${this.botDto.BotName} Bot Error : ${err.message}`;
            (0, botMail_utils_1.sendErrorNotificationToAdmins)(this.mailNotificationService, message);
        }
    }
    async handleCloseOrder(order) {
        try {
            let strategyService = this.strategyService;
            let botName = this.botDto.BotName;
            let botSlag = this.botDto.strategySlug;
            let orderPayload = {
                copyOrderId: `${botName}-${order.id}`,
                isolated: Boolean(order.isolated),
                leverage: Number(order.leverage),
                price: Number(order.entryPrice),
                quantity: Math.abs(Number(order.positionAmount)),
                side: order.positionSide.toUpperCase(),
                signalType: BinanceEnum_1.SignalTypeEnum.PARTIAL_CLOSE,
                symbol: order.symbol,
                type: "MARKET"
            };
            let result = await strategyService.handleWebHook(botSlag, orderPayload);
            let message = `Order Closed for ${order.symbol} with ${order.positionAmount} quantity`;
            if (typeof result.payload == "string") {
                message += `\n but something went wrong, it returns: ${result.payload}`;
            }
            (0, botMail_utils_1.sendSuccessNotificationToAdmins)(this.mailNotificationService, message);
        }
        catch (err) {
            console.error(`Error Occured on order close in ${this.botDto.BotName} Bot!`, err);
            let message = `Order Closed for ${order.symbol} Error : ${err.message}`;
            (0, botMail_utils_1.sendErrorNotificationToAdmins)(this.mailNotificationService, message);
        }
    }
    async updateBotDb(id, payload) {
        try {
            await this.BotModel.updateOne({ _id: id }, payload);
        }
        catch (err) {
            let message = `Error Occured while updating ${this.botDto.BotName} bot in database Error:\n${err.message}`;
            (0, botMail_utils_1.sendErrorNotificationToAdmins)(this.mailNotificationService, message);
        }
    }
}
exports.ScrapWorker = ScrapWorker;
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
                .catch(async (error) => {
                if (error?.response?.data?.code === '100002001') {
                    reject(error);
                }
                else if (attempt < 10) {
                    requestData(attempt + 1).then(resolve).catch(reject);
                }
                else {
                    reject(error);
                }
            });
        });
    };
    return requestData();
}
let index = 0;
function mockprocessCopyTradeRequest(...arg) {
    return new Promise(resolve => {
        let currentRes = dummySignal_1.dummyOrderData[index];
        index++;
        resolve({
            data: currentRes
        });
    });
}
//# sourceMappingURL=scraperService.js.map