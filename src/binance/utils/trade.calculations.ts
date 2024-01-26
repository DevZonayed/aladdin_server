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

