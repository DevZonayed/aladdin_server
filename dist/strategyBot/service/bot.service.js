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
exports.BotService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../../common/constants");
const strategy_service_1 = require("../../strategy/service/strategy.service");
const bot_entity_1 = require("../entities/bot.entity");
const worker_service_1 = require("../worker/service/worker.service");
let BotService = class BotService {
    constructor(BotModel, workerService, strategyService) {
        this.BotModel = BotModel;
        this.workerService = workerService;
        this.strategyService = strategyService;
    }
    async create(createBotDto) {
        try {
            let strategySlug = createBotDto.strategySlug || "";
            let strategy = await this.strategyService.findBySlug(strategySlug);
            if (!strategy) {
                return (0, constants_1.createApiResponse)(common_1.HttpStatus.NOT_FOUND, constants_1.NO_DATA_FOUND, constants_1.STRATEGY_NOT_FOUND, null);
            }
            const createBot = new this.BotModel(createBotDto);
            await createBot.save();
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.CREATED, constants_1.SUCCESS_RESPONSE, constants_1.STRATEGY_BOT_CREATED_SUCCESSFULLY, createBot);
        }
        catch (err) {
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.CONFLICT, constants_1.FAIELD_RESPONSE, constants_1.STRATEGY_BOT_CREATED_FAILED, err.message);
        }
    }
    async handleStartBot(id) {
        try {
            const bot = await this.BotModel.findById(id);
            if (!bot) {
                return (0, constants_1.createApiResponse)(common_1.HttpStatus.NOT_FOUND, constants_1.NO_DATA_FOUND, constants_1.STRATEGY_BOT_NOT_FOUND, null);
            }
            let result = await this.workerService.handleStartWorker(bot);
            return result;
        }
        catch (err) {
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.CONFLICT, constants_1.FAIELD_RESPONSE, constants_1.SOMETHING_WENT_WRONG, err.message);
        }
    }
    async handleStopBot(id) {
        try {
            const bot = await this.BotModel.findById(id);
            if (!bot) {
                return (0, constants_1.createApiResponse)(common_1.HttpStatus.NOT_FOUND, constants_1.NO_DATA_FOUND, constants_1.STRATEGY_BOT_NOT_FOUND, null);
            }
            let result = await this.workerService.handleStopWorker(bot);
            return result;
        }
        catch (err) {
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.CONFLICT, constants_1.FAIELD_RESPONSE, constants_1.SOMETHING_WENT_WRONG, err.message);
        }
    }
    async getBotStatus(id) {
        const bot = await this.BotModel.findById(id);
        if (!bot) {
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.NOT_FOUND, constants_1.NO_DATA_FOUND, constants_1.STRATEGY_BOT_NOT_FOUND, null);
        }
        let result = await this.workerService.getBotStatus(bot);
        return result;
    }
    async findAll(page, limit, order, sort, search, startDate, endDate) {
        try {
            const pipeline = [];
            const matchStage = {};
            if (search) {
                const searchRegex = new RegExp(search, 'i');
                const allFields = Object.keys(this.BotModel.schema.obj);
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
            const totalResult = await this.BotModel.aggregate(pipeline);
            const total = totalResult.length > 0 ? totalResult[0].total : 0;
            pipeline.pop();
            const startIndex = (page - 1) * limit;
            pipeline.push({ $skip: startIndex }, { $limit: parseInt(limit.toString(), 10) });
            const sortStage = {};
            sortStage[order] = sort === 'desc' ? -1 : 1;
            pipeline.push({ $sort: sortStage });
            const data = await this.BotModel.aggregate(pipeline);
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
            const data = await this.BotModel.findById(id).exec();
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
    async update(id, updateBotDto) {
        try {
            const data = await this.BotModel
                .findByIdAndUpdate(id, updateBotDto, { new: true })
                .exec();
            await this.handleStartBot(data.BotName);
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.OK, constants_1.SUCCESS_RESPONSE, constants_1.DATA_FOUND, data);
        }
        catch (error) {
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, constants_1.FAIELD_RESPONSE, constants_1.SOMETHING_WENT_WRONG, error);
        }
    }
    async remove(id) {
        try {
            const data = await this.BotModel.findByIdAndDelete(id).exec();
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
exports.BotService = BotService;
exports.BotService = BotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bot_entity_1.Bot.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        worker_service_1.WorkerService,
        strategy_service_1.StrategyService])
], BotService);
//# sourceMappingURL=bot.service.js.map