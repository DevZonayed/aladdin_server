import { CreatedByEnum } from "src/order/enums/createdBy.enum";
import { StatusEnum } from "src/order/enums/status.enum";
import { SignalTypeEnum } from "../enum/BinanceEnum";

export function computeClosedOrderQuantity(order, orderDto) {
    if (Array.isArray(order)) {
        return order.reduce((sum, item) => sum + Number(item?.origQty || 0), 0);
    } else if (order && order.origQty) {
        return Number(order.origQty);
    } else {
        return Number(orderDto.quantity);
    }
}

export function computeOrderTotalQuantity(order, orderDto) {
    if (order && order.origQty) {
        return Number(order.origQty);
    } else {
        return Number(orderDto.quantity);
    }
}


export function computeAllOrderOrderQuantity(orders) {
    return orders.reduce((total, order) => total + parseFloat(order?.origQty), 0);
}


export function identifyOrdersForCancellation(orders: any, targetQty: number, targetSide: String) {

    targetSide = targetSide.toUpperCase();
    const filteredOrders = orders.filter((order: any) => {
        if (targetSide === 'LONG') {
            return order.side === 'BUY' && order.positionSide === 'LONG';
        } else if (targetSide === 'SHORT') {
            return order.side === 'SELL' && order.positionSide === 'SHORT';
        }
    });

    if (!filteredOrders.length) {
        return [];
    }

    filteredOrders.sort((a: any, b: any) => parseFloat(a?.origQty) - parseFloat(b?.origQty));

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


export function generateFutureOrdersResponse(userId, data, orderDto, strategy, isSuccess, ratio = null) {
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



export async function safePromiseBuild(apiCall, identifier = "") {
    return apiCall.then(
        result => ({ result, identifier, success: true }),
        error => ({ error, identifier, success: false })
    );
};




export function retrieveDataFromOrderResult(result: any) {
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



export function buildNewOrderPayload(success, userId, strategy, orderDto, order, ratio, message) {
    let payload: any = {
        userId,
        strategyId: strategy._id,
        copyOrderId: orderDto.copyOrderId,
        binanceOrderId: order.orderId,
        createdBy: CreatedByEnum.STRATEGY,
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
    } else {
        payload = {
            ...payload,
            binanceOrderId: null,
            orderQty: null,
            status: StatusEnum.CLOSED,
            closeReason: message
        };
    }

    return payload;
}



export function computeOrderUpdateDetails(orderData, orderDto, order) {
    let updatePayload = {};

    if (orderDto.signalType === SignalTypeEnum.PARTIAL_CLOSE || orderDto.signalType === SignalTypeEnum.CLOSE) {
        let closedQuantity = orderData.closedQty + computeClosedOrderQuantity(order, orderDto);
        let totalOrderQuantity = orderData.orderQty;

        if (totalOrderQuantity <= closedQuantity) {
            updatePayload = {
                closedQty: closedQuantity,
                status: StatusEnum.CLOSED,
                closeReason: `${orderDto.signalType} Signals Quantity Sell Achived!`
            };
        } else {
            updatePayload = {
                closedQty: closedQuantity
            };
        }
    } else {
        let totalOrderQuantity = orderData.orderQty + computeOrderTotalQuantity(order, orderDto);
        updatePayload = { orderQty: totalOrderQuantity };
    }

    return updatePayload;
}