"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalTypeEnum = exports.PositionTypeEnum = exports.MarginTypeEnum = exports.PositionSideEnum = void 0;
var PositionSideEnum;
(function (PositionSideEnum) {
    PositionSideEnum["LONG"] = "LONG";
    PositionSideEnum["SHORT"] = "SHORT";
})(PositionSideEnum || (exports.PositionSideEnum = PositionSideEnum = {}));
var MarginTypeEnum;
(function (MarginTypeEnum) {
    MarginTypeEnum["ISOLATED"] = "ISOLATED";
    MarginTypeEnum["CROSSED"] = "CROSSED";
})(MarginTypeEnum || (exports.MarginTypeEnum = MarginTypeEnum = {}));
var PositionTypeEnum;
(function (PositionTypeEnum) {
    PositionTypeEnum["MARKET"] = "MARKET";
    PositionTypeEnum["LIMIT"] = "LIMIT";
})(PositionTypeEnum || (exports.PositionTypeEnum = PositionTypeEnum = {}));
var SignalTypeEnum;
(function (SignalTypeEnum) {
    SignalTypeEnum["NEW"] = "NEW";
    SignalTypeEnum["RE_ENTRY"] = "RE_ENTRY";
    SignalTypeEnum["PARTIAL_CLOSE"] = "PARTIAL_CLOSE";
    SignalTypeEnum["CLOSE"] = "CLOSE";
})(SignalTypeEnum || (exports.SignalTypeEnum = SignalTypeEnum = {}));
//# sourceMappingURL=BinanceEnum.js.map