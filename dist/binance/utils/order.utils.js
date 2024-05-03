"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeOrderUpdateDetails = exports.buildNewOrderPayload = exports.retrieveDataFromOrderResult = exports.safePromiseBuild = exports.generateFutureOrdersResponse = exports.identifyOrdersForCancellation = exports.computeAllOrderOrderQuantity = exports.computeOrderTotalQuantity = exports.computeClosedOrderQuantity = void 0;
const createdBy_enum_1 = require("../../order/enums/createdBy.enum");
const status_enum_1 = require("../../order/enums/status.enum");
const BinanceEnum_1 = require("../enum/BinanceEnum");
function computeClosedOrderQuantity(order, orderDto) {
    if (Array.isArray(order)) {
        return order.reduce((sum, item) => sum + Number(item?.origQty || 0), 0);
    }
    else if (order && order.origQty) {
        return Number(order.origQty);
    }
    else {
        return Number(orderDto.quantity);
    }
}
exports.computeClosedOrderQuantity = computeClosedOrderQuantity;
function computeOrderTotalQuantity(order, orderDto) {
    if (order && order.origQty) {
        return Number(order.origQty);
    }
    else {
        return Number(orderDto.quantity);
    }
}
exports.computeOrderTotalQuantity = computeOrderTotalQuantity;
function computeAllOrderOrderQuantity(orders) {
    return orders.reduce((total, order) => total + parseFloat(order?.origQty), 0);
}
exports.computeAllOrderOrderQuantity = computeAllOrderOrderQuantity;
function identifyOrdersForCancellation(orders, targetQty, targetSide) {
    targetSide = targetSide.toUpperCase();
    const filteredOrders = orders.filter((order) => {
        if (targetSide === 'LONG') {
            return order.side === 'BUY' && order.positionSide === 'LONG';
        }
        else if (targetSide === 'SHORT') {
            return order.side === 'SELL' && order.positionSide === 'SHORT';
        }
    });
    if (!filteredOrders.length) {
        return [];
    }
    filteredOrders.sort((a, b) => parseFloat(a?.origQty) - parseFloat(b?.origQty));
    let totalQty = 0;
    let ordersToCancel = [];
    for (const order of filteredOrders) {
        totalQty += parseFloat(order?.origQty);
        ordersToCancel.push(order?.orderId);
        if (totalQty >= targetQty) {
            break;
        }
    }
    return ordersToCancel;
}
exports.identifyOrdersForCancellation = identifyOrdersForCancellation;
function generateFutureOrdersResponse(userId, data, orderDto, strategy, isSuccess, ratio = null) {
    if (!isSuccess) {
        return {
            userId,
            orderDto,
            strategy,
            success: false,
            message: data?.message || "Order failed"
        };
    }
    return {
        userId,
        orderDto,
        strategy,
        ratio,
        order: data,
        success: true
    };
}
exports.generateFutureOrdersResponse = generateFutureOrdersResponse;
async function safePromiseBuild(apiCall, identifier = "") {
    return apiCall.then(result => ({ result, identifier, success: true }), error => ({ error, identifier, success: false }));
}
exports.safePromiseBuild = safePromiseBuild;
;
function retrieveDataFromOrderResult(result) {
    return {
        userId: result.userId,
        orderDto: result.orderDto,
        success: result.success,
        message: result.message,
        order: result?.order,
        ratio: result?.ratio,
        strategy: result.strategy
    };
}
exports.retrieveDataFromOrderResult = retrieveDataFromOrderResult;
function buildNewOrderPayload(success, userId, strategy, orderDto, order, ratio, message) {
    let payload = {
        userId,
        strategyId: strategy._id,
        copyOrderId: orderDto.copyOrderId,
        binanceOrderId: order.orderId,
        createdBy: createdBy_enum_1.CreatedByEnum.STRATEGY,
        symbol: orderDto.symbol,
        type: orderDto.type,
        side: orderDto.side,
        entryPrice: order.price,
        orderQty: order.origQty,
        leverage: orderDto.leverage,
        isolated: orderDto.isolated,
        initialOrderRatio: ratio
    };
    if (success) {
        payload = {
            ...payload,
            binanceOrderId: order.orderId,
            entryPrice: order.price,
            orderQty: order.origQty,
            initialOrderRatio: ratio
        };
    }
    else {
        payload = {
            ...payload,
            binanceOrderId: null,
            orderQty: null,
            status: status_enum_1.StatusEnum.CLOSED,
            closeReason: message
        };
    }
    return payload;
}
exports.buildNewOrderPayload = buildNewOrderPayload;
function computeOrderUpdateDetails(orderData, orderDto, order) {
    let updatePayload = {};
    if (orderDto.signalType === BinanceEnum_1.SignalTypeEnum.PARTIAL_CLOSE || orderDto.signalType === BinanceEnum_1.SignalTypeEnum.CLOSE) {
        let closedQuantity = orderData.closedQty + computeClosedOrderQuantity(order, orderDto);
        let totalOrderQuantity = orderData.orderQty;
        if (totalOrderQuantity <= closedQuantity) {
            updatePayload = {
                closedQty: closedQuantity,
                status: status_enum_1.StatusEnum.CLOSED,
                closeReason: `${orderDto.signalType} Signals Quantity Sell Achived!`
            };
        }
        else {
            updatePayload = {
                closedQty: closedQuantity
            };
        }
    }
    else {
        let totalOrderQuantity = orderData.orderQty + computeOrderTotalQuantity(order, orderDto);
        updatePayload = { orderQty: totalOrderQuantity };
    }
    return updatePayload;
}
exports.computeOrderUpdateDetails = computeOrderUpdateDetails;
//# sourceMappingURL=order.utils.js.map