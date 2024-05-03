"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../../common/constants");
const order_entity_1 = require("../entities/order.entity");
const status_enum_1 = require("../enums/status.enum");
let OrderService = class OrderService {
    constructor(OrderModel) {
        this.OrderModel = OrderModel;
    }
    async create(createOrderDto) {
        try {
            const createOrder = new this.OrderModel(createOrderDto);
            await createOrder.save();
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.CREATED, constants_1.SUCCESS_RESPONSE, constants_1.ORDER_CREATE_SUCCESS, createOrder);
        }
        catch (err) {
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.CONFLICT, constants_1.FAIELD_RESPONSE, constants_1.ORDER_CREATE_FAILED, err.message);
        }
    }
    async findAll(page, limit, order, sort, search, startDate, endDate) {
        try {
            const pipeline = [];
            const matchStage = {};
            if (search) {
                const searchRegex = new RegExp(search, 'i');
                const allFields = Object.keys(this.OrderModel.schema.obj);
                matchStage.$or = allFields.map((field) => ({
                    [field]: { $regex: searchRegex },
                }));
            }
            if (startDate && endDate) {
                const startDateObject = new Date(startDate);
                const endDateObject = new Date(endDate);
                matchStage.createdAt = {
                    $gte: startDateObject,
                    $lt: endDateObject,
                };
            }
            if (Object.keys(matchStage).length > 0) {
                pipeline.push({ $match: matchStage });
            }
            pipeline.push({ $count: 'total' });
            const totalResult = await this.OrderModel.aggregate(pipeline);
            const total = totalResult.length > 0 ? totalResult[0].total : 0;
            pipeline.pop();
            const startIndex = (page - 1) * limit;
            pipeline.push({ $skip: startIndex }, { $limit: parseInt(limit.toString(), 10) });
            const sortStage = {};
            sortStage[order] = sort === 'desc' ? -1 : 1;
            pipeline.push({ $sort: sortStage });
            const data = await this.OrderModel.aggregate(pipeline);
            const totalPages = Math.ceil(total / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;
            const nextPage = hasNextPage ? Number(page) + 1 : null;
            const prevPage = hasPrevPage ? Number(page) - 1 : null;
            if (data.length > 0) {
                return (0, constants_1.createApiResponse)(common_1.HttpStatus.OK, constants_1.SUCCESS_RESPONSE, constants_1.DATA_FOUND, {
                    data,
                    pagination: {
                        total,
                        totalPages,
                        currentPage: Number(page),
                        hasNextPage,
                        hasPrevPage,
                        nextPage,
                        prevPage,
                    },
                });
            }
            else {
                return (0, constants_1.createApiResponse)(common_1.HttpStatus.OK, constants_1.SUCCESS_RESPONSE, constants_1.NO_DATA_FOUND);
            }
        }
        catch (error) {
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, constants_1.FAIELD_RESPONSE, constants_1.SOMETHING_WENT_WRONG, error);
        }
    }
    async findOne(id) {
        try {
            const data = await this.OrderModel.findById(id).exec();
            if (data) {
                return (0, constants_1.createApiResponse)(common_1.HttpStatus.OK, constants_1.SUCCESS_RESPONSE, constants_1.DATA_FOUND, data);
            }
            else {
                return (0, constants_1.createApiResponse)(common_1.HttpStatus.NOT_FOUND, constants_1.SUCCESS_RESPONSE, constants_1.NO_DATA_FOUND);
            }
        }
        catch (error) {
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, constants_1.FAIELD_RESPONSE, constants_1.SOMETHING_WENT_WRONG, error);
        }
    }
    async findAllOpenOrders(userId) {
        try {
            const data = await this.OrderModel.find({ status: status_enum_1.StatusEnum.OPEN, userId }).exec();
            if (data) {
                return {
                    status: true,
                    data,
                };
            }
            else {
                return {
                    status: false,
                    data,
                };
            }
        }
        catch (error) {
            return {
                status: false,
                error: "Failed to find open order" + error.message,
            };
        }
    }
    async findOpenOrder(strategyId, copyOrderId, userId, symbol, side) {
        try {
            const data = await this.OrderModel.findOne({ status: status_enum_1.StatusEnum.OPEN, strategyId, copyOrderId, userId, side, symbol }).exec();
            if (data) {
                return {
                    status: true,
                    data,
                };
            }
            else {
                return {
                    status: false,
                    data,
                };
            }
        }
        catch (error) {
            return {
                status: false,
                error: "Failed to find open order" + error.message,
            };
        }
    }
    async update(id, updateOrderDto) {
        try {
            const data = await this.OrderModel
                .findByIdAndUpdate(id, updateOrderDto, { new: true })
                .exec();
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.OK, constants_1.SUCCESS_RESPONSE, constants_1.DATA_FOUND, data);
        }
        catch (error) {
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, constants_1.FAIELD_RESPONSE, constants_1.SOMETHING_WENT_WRONG, error);
        }
    }
    async remove(id) {
        try {
            const data = await this.OrderModel.findByIdAndDelete(id).exec();
            if (data) {
                return (0, constants_1.createApiResponse)(common_1.HttpStatus.OK, constants_1.SUCCESS_RESPONSE, constants_1.DATA_FOUND, data);
            }
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.NOT_FOUND, constants_1.FAIELD_RESPONSE, constants_1.NO_DATA_FOUND);
        }
        catch (error) {
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, constants_1.FAIELD_RESPONSE, constants_1.SOMETHING_WENT_WRONG, error);
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_entity_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrderService);
//# sourceMappingURL=order.service.js.map