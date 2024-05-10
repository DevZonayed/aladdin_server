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
const constants_1 = require("../../common/constants");
const user_service_1 = require("../../user/service/user.service");
const strategy_entity_1 = require("../entities/strategy.entity");
let StrategyService = class StrategyService {
    constructor(StrategyModel, binanceService, userService) {
        this.StrategyModel = StrategyModel;
        this.binanceService = binanceService;
        this.userService = userService;
    }
    async create(createStrategyDto) {
        try {
            const createStrategy = new this.StrategyModel(createStrategyDto);
            await createStrategy.save();
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.CREATED, constants_1.SUCCESS_RESPONSE, constants_1.STRATEGY_CREATED_SUCCESSFULLY, createStrategy);
        }
        catch (err) {
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.CONFLICT, constants_1.FAIELD_RESPONSE, constants_1.STRATEGY_CREATED_FAILED, err.message);
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
            const data = await this.StrategyModel.findById(id).exec();
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
    async findBySlug(slug) {
        try {
            const data = await this.StrategyModel.findOne({ apiSlug: slug }).exec();
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
    async update(id, updateStrategyDto) {
        try {
            const data = await this.StrategyModel
                .findByIdAndUpdate(id, updateStrategyDto, { new: true })
                .exec();
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.OK, constants_1.SUCCESS_RESPONSE, constants_1.DATA_FOUND, data);
        }
        catch (error) {
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, constants_1.FAIELD_RESPONSE, constants_1.SOMETHING_WENT_WRONG, error);
        }
    }
    async remove(id) {
        try {
            const data = await this.StrategyModel.findByIdAndDelete(id).exec();
            if (data) {
                return (0, constants_1.createApiResponse)(common_1.HttpStatus.OK, constants_1.SUCCESS_RESPONSE, constants_1.DATA_FOUND, data);
            }
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.NOT_FOUND, constants_1.FAIELD_RESPONSE, constants_1.NO_DATA_FOUND);
        }
        catch (error) {
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, constants_1.FAIELD_RESPONSE, constants_1.SOMETHING_WENT_WRONG, error);
        }
    }
    async handleWebHook(endPoint, order) {
        try {
            console.warn({
                endPoint,
                order,
            });
            let strategy = await this.StrategyModel.findOne({ apiSlug: endPoint });
            if (!strategy) {
                return (0, constants_1.createApiResponse)(common_1.HttpStatus.NOT_FOUND, constants_1.FAIELD_RESPONSE, constants_1.NO_DATA_FOUND, []);
            }
            const credentials = await this.userService.getCredentialsOfStrategy(strategy._id);
            if (credentials.length === 0) {
                return (0, constants_1.createApiResponse)(common_1.HttpStatus.NOT_FOUND, constants_1.FAIELD_RESPONSE, constants_1.NO_CREDENTIALS_DATA_FOUND, []);
            }
            const allowAssets = strategy?.allowAssets || null;
            const bannedAssets = strategy?.bannedAssets || null;
            if (allowAssets && allowAssets.length > 0) {
                let symbol = order?.symbol?.toUpperCase() || "";
                if (!allowAssets.includes(symbol)) {
                    return (0, constants_1.createApiResponse)(common_1.HttpStatus.CONTINUE, constants_1.FAIELD_RESPONSE, constants_1.ASSET_NOT_ALLOWED, []);
                }
            }
            else if (bannedAssets && bannedAssets.length > 0) {
                let symbol = order?.symbol?.toUpperCase() || "";
                if (bannedAssets.includes(symbol)) {
                    return (0, constants_1.createApiResponse)(common_1.HttpStatus.CONTINUE, constants_1.FAIELD_RESPONSE, constants_1.ASSET_NOT_ALLOWED, []);
                }
            }
            return await this.binanceService.createStrategyOrders(strategy, credentials, order);
        }
        catch (err) {
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.INTERNAL_SERVER_ERROR, constants_1.FAIELD_RESPONSE, constants_1.SOMETHING_WENT_WRONG, err.message);
        }
    }
};
exports.StrategyService = StrategyService;
exports.StrategyService = StrategyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(strategy_entity_1.Strategy.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => binance_service_1.BinanceService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        binance_service_1.BinanceService,
        user_service_1.UserService])
], StrategyService);
//# sourceMappingURL=strategy.service.js.map