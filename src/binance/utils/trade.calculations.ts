export function calculateParentTradePercentage(capital: number, quantity: number, entryPrice: number) {
    capital = Number(capital);
    quantity = Number(quantity);
    entryPrice = Number(entryPrice);
    const totalCost = quantity * entryPrice;
    const percentageUsed = (totalCost / capital) * 100;
    return percentageUsed;
}


export function calculateTradeDetailsForUser(capital: number, percentage: number, entryPrice: number) {
    capital = Number(capital);
    percentage = Number(percentage);
    entryPrice = Number(entryPrice);
    const tradeAmount = (capital * percentage) / 100;
    const quantity = tradeAmount / entryPrice;
    const cost = quantity * entryPrice;
    return [quantity, cost];
}

export function calculateQuantity(amount: number, entryPrice: number) {
    amount = Number(amount);
    entryPrice = Number(entryPrice);
    const quantity = amount / entryPrice
    return quantity;
}



// Order Quantity Calculation
export function calculateMyTradeAmount(traderTradeAmount, traderBalance, myBalance, myMaxTrade = 200, persistentRatio = null) {
    let ratio = persistentRatio;
    // If the persistent ratio is not set, calculate it
    if (!ratio) {
        const initialRatio = myBalance / traderBalance;
        let myInitialTradeAmount = traderTradeAmount * initialRatio;

        // If the initial trade amount exceeds the max, set the persistent ratio
        if (myInitialTradeAmount > myMaxTrade) {
            ratio = myMaxTrade / traderTradeAmount;
            myInitialTradeAmount = myMaxTrade;
        } else {
            ratio = initialRatio;
        }
        return {
            tradeAmount: myInitialTradeAmount,
            ratio
        };
    } else {
        // Use the persistent ratio for subsequent trades
        let tradeAmount = Math.min(traderTradeAmount * ratio, myMaxTrade);
        return {
            tradeAmount,
            ratio
        }
    }
}


export function calculateAmountFromPercentage(amount: any, percentage: any): number {
    amount = Number(amount);
    percentage = Number(percentage) || 100;
    if (!amount || !percentage) {
        throw new Error("Invalid amount or percentage to calculate trade amount");
    }
    return (amount * percentage) / 100;
}