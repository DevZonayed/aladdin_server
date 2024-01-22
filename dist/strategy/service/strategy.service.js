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
exports.StrategyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const binance_service_1 = require("../../binance/service/binance.service");
const user_service_1 = require("../../user/service/user.service");
const constants_1 = require("../../common/constants");
const create_api_response_1 = require("../../common/constants/create-api.response");
const strategy_entity_1 = require("../entities/strategy.entity");
let StrategyService = class StrategyService {
    constructor(StrategyModel, userService, binanceService) {
        this.StrategyModel = StrategyModel;
        this.userService = userService;
        this.binanceService = binanceService;
    }
    async create(createStrategyDto) {
        try {
            const createStrategy = new this.StrategyModel(createStrategyDto);
            await createStrategy.save();
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.CREATED, constants_1.SUCCESS_RESPONSE, constants_1.STRATEGY_CREATED_SUCCESSFULLY, createStrategy);
        }
        catch (err) {
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.CONFLICT, constants_1.FAIELD_RESPONSE, constants_1.STRATEGY_CREATED_FAILED, err.message);
        }
    }
    async findAll(page, limit, order, sort, search, startDate, endDate) {
        try {
            const pipeline = [];
            const matchStage = {};
            if (search) {
                const searchRegex = new RegExp(search, 'i');
                const allFields = Object.keys(this.StrategyModel.schema.obj);
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
            const totalResult = await this.StrategyModel.aggregate(pipeline);
            const total = totalResult.length > 0 ? totalResult[0].total : 0;
            pipeline.pop();
            const startIndex = (page - 1) * limit;
            pipeline.push({ $skip: startIndex }, { $limit: parseInt(limit.toString(), 10) });
            const sortStage = {};
            sortStage[order] = sort === 'desc' ? -1 : 1;
            pipeline.push({ $sort: sortStage });
            const data = await this.StrategyModel.aggregate(pipeline);
            const totalPages = Math.ceil(total / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;
            const nextPage = hasNextPage ? Number(page) + 1 : null;
            const prevPage = hasPrevPage ? Number(page) - 1 : null;
            if (data.length > 0) {
                return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.OK, constants_1.SUCCESS_RESPONSE, constants_1.DATA_FOUND, {
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
                return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.OK, constants_1.SUCCESS_RESPONSE, constants_1.NO_DATA_FOUND);
            }
        }
        catch (error) {
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, constants_1.FAIELD_RESPONSE, constants_1.SOMETHING_WENT_WRONG, error);
        }
    }
    async findOne(id) {
        try {
            const data = await this.StrategyModel.findById(id).exec();
            if (data) {
                return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.OK, constants_1.SUCCESS_RESPONSE, constants_1.DATA_FOUND, data);
            }
            else {
                return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.NOT_FOUND, constants_1.SUCCESS_RESPONSE, constants_1.NO_DATA_FOUND);
            }
        }
        catch (error) {
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, constants_1.FAIELD_RESPONSE, constants_1.SOMETHING_WENT_WRONG, error);
        }
    }
    update(id, updateStrategyDto) {
        try {
            const data = this.StrategyModel
                .findByIdAndUpdate(id, updateStrategyDto, { new: true })
                .exec();
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.OK, constants_1.SUCCESS_RESPONSE, constants_1.DATA_FOUND, data);
        }
        catch (error) {
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, constants_1.FAIELD_RESPONSE, constants_1.SOMETHING_WENT_WRONG, error);
        }
    }
    async remove(id) {
        try {
            const data = await this.StrategyModel.findByIdAndDelete(id).exec();
            if (data) {
                return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.OK, constants_1.SUCCESS_RESPONSE, constants_1.DATA_FOUND, data);
            }
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.NOT_FOUND, constants_1.FAIELD_RESPONSE, constants_1.NO_DATA_FOUND);
        }
        catch (error) {
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, constants_1.FAIELD_RESPONSE, constants_1.SOMETHING_WENT_WRONG, error);
        }
    }
    async handleWebHook(endPoint) {
        try {
            const strategy = await this.StrategyModel.findOne({ apiSlug: endPoint }).exec();
            if (!strategy) {
                return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.NOT_FOUND, constants_1.FAIELD_RESPONSE, constants_1.NO_DATA_FOUND);
            }
            let credentials = await this.userService.getCredentialsOfStrategy(strategy._id);
            if (credentials[0]?.binanceCredentials) {
                let { apiKey, apiSecret } = credentials[0]?.binanceCredentials;
                let balence = await this.binanceService.checkBalance(apiKey, apiSecret);
                return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.ACCEPTED, constants_1.SUCCESS_RESPONSE, "Strategy Webhook Received", balence);
            }
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.ACCEPTED, constants_1.SUCCESS_RESPONSE, "Strategy Webhook Received", []);
        }
        catch (err) {
            console.log(err);
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.INTERNAL_SERVER_ERROR, constants_1.FAIELD_RESPONSE, constants_1.SOMETHING_WENT_WRONG, err.message);
        }
    }
};
exports.StrategyService = StrategyService;
exports.StrategyService = StrategyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(strategy_entity_1.Strategy.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService,
        binance_service_1.BinanceService])
], StrategyService);
//# sourceMappingURL=strategy.service.js.map