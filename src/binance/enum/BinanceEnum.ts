export enum PositionSideEnum {
    LONG = "LONG",
    SHORT = "SHORT"
}

export enum MarginTypeEnum {
    ISOLATED = "ISOLATED",
    CROSSED = "CROSSED"
}

export enum PositionTypeEnum {
    MARKET = "MARKET",
    LIMIT = "LIMIT",
    STOP_LOSS = "STOP_LOSS",
    STOP_LOSS_LIMIT = "STOP_LOSS_LIMIT",
    TAKE_PROFIT = "TAKE_PROFIT",
    TAKE_PROFIT_LIMIT = "TAKE_PROFIT_LIMIT",
    LIMIT_MAKER = "LIMIT_MAKER"
}


export enum SignalTypeEnum {
    NEW = "NEW",
    RE_ENTRY = "RE_ENTRY",
    PARTIAL_CLOSE = "PARTIAL_CLOSE",
    CLOSE = "CLOSE"
}