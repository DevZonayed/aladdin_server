"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateQuantity = exports.calculateTradeDetailsForUser = exports.calculateParentTradePercentage = void 0;
function calculateParentTradePercentage(capital, quantity, entryPrice) {
    capital = Number(capital);
    quantity = Number(quantity);
    entryPrice = Number(entryPrice);
    const totalCost = quantity * entryPrice;
    const percentageUsed = (totalCost / capital) * 100;
    return percentageUsed;
}
exports.calculateParentTradePercentage = calculateParentTradePercentage;
function calculateTradeDetailsForUser(capital, percentage, entryPrice) {
    capital = Number(capital);
    percentage = Number(percentage);
    entryPrice = Number(entryPrice);
    const tradeAmount = (capital * percentage) / 100;
    const quantity = tradeAmount / entryPrice;
    const cost = quantity * entryPrice;
    return [quantity, cost];
}
exports.calculateTradeDetailsForUser = calculateTradeDetailsForUser;
function calculateQuantity(amount, entryPrice) {
    amount = Number(amount);
    entryPrice = Number(entryPrice);
    const quantity = amount / entryPrice;
    return quantity;
}
exports.calculateQuantity = calculateQuantity;
//# sourceMappingURL=trade.calculations.js.map