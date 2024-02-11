import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DATA_FOUND, FAIELD_RESPONSE, NO_DATA_FOUND, SOMETHING_WENT_WRONG, STRATEGY_BOT_CREATED_FAILED, STRATEGY_BOT_CREATED_SUCCESSFULLY, STRATEGY_BOT_NOT_FOUND, STRATEGY_NOT_FOUND, SUCCESS_RESPONSE, createApiResponse } from 'src/common/constants';
import { SortBy } from 'src/common/enum/enum-sort-by';
import { StrategyService } from 'src/strategy/service/strategy.service';
import { CreateBotDto } from '../dto/create-bot.dto';
import { UpdateBotDto } from '../dto/update-bot.dto';
import { UpdateBotTokenDto } from '../dto/update-tokens.dto';
import { Bot } from '../entities/bot.entity';
import { WorkerService } from '../worker/service/worker.service';

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot.name)
    private readonly BotModel: Model<Bot>,
    private readonly workerService: WorkerService,
    private readonly strategyService: StrategyService,
  ) { }

  async create(
    createBotDto: CreateBotDto,
  ) {
    try {
      let strategySlug = createBotDto.strategySlug || "";
      let strategy = await this.strategyService.findBySlug(strategySlug);
      if (!strategy) {
        return createApiResponse(
          HttpStatus.NOT_FOUND,
          NO_DATA_FOUND,
          STRATEGY_NOT_FOUND,
          null,
        );
      }

      const createBot = new this.BotModel(
        createBotDto,
      );
      await createBot.save();
      return createApiResponse(
        HttpStatus.CREATED,
        SUCCESS_RESPONSE,
        STRATEGY_BOT_CREATED_SUCCESSFULLY,
        createBot,
      );
    } catch (err) {
      return createApiResponse(
        HttpStatus.CONFLICT,
        FAIELD_RESPONSE,
        STRATEGY_BOT_CREATED_FAILED,
        err.message,
      );
    }
  }

  async handleStartBot(id: string) {
    try {
      const bot = await this.BotModel.findById(id);
      if (!bot) {
        return createApiResponse(
          HttpStatus.NOT_FOUND,
          NO_DATA_FOUND,
          STRATEGY_BOT_NOT_FOUND,
          null,
        );
      }

      return await this.workerService.handleStartWorker(bot);

    } catch (err) {
      return createApiResponse(
        HttpStatus.CONFLICT,
        FAIELD_RESPONSE,
        SOMETHING_WENT_WRONG,
        err.message,
      );
    }
  }

  async handleStopBot(id: string) {
    try {
      const bot = await this.BotModel.findById(id);
      if (!bot) {
        return createApiResponse(
          HttpStatus.NOT_FOUND,
          NO_DATA_FOUND,
          STRATEGY_BOT_NOT_FOUND,
          null,
        );
      }
      let result = await this.workerService.handleStopWorker(bot);
      return result;
    } catch (err) {
      return createApiResponse(
        HttpStatus.CONFLICT,
        FAIELD_RESPONSE,
        SOMETHING_WENT_WRONG,
        err.message,
      );
    }
  }

  async getBotStatus(id: string) {
    const bot = await this.BotModel.findById(id);
    if (!bot) {
      return createApiResponse(
        HttpStatus.NOT_FOUND,
        NO_DATA_FOUND,
        STRATEGY_BOT_NOT_FOUND,
        null,
      );
    }

    let result = await this.workerService.getBotStatus(bot);
    return result;
  }

  async findAll(
    page: number,
    limit: number,
    order: string,
    sort: SortBy,
    search: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    try {
      const pipeline: any[] = [];
      const matchStage: any = {};

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

      pipeline.push(
        { $skip: startIndex },
        { $limit: parseInt(limit.toString(), 10) },
      );

      const sortStage: any = {};
      sortStage[order] = sort === 'desc' ? -1 : 1;
      pipeline.push({ $sort: sortStage });

      const data = await this.BotModel.aggregate(pipeline);

      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      const nextPage = hasNextPage ? Number(page) + 1 : null;
      const prevPage = hasPrevPage ? Number(page) - 1 : null;

      if (data.length > 0) {
        return createApiResponse(HttpStatus.OK, SUCCESS_RESPONSE, DATA_FOUND, {
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
      } else {
        return createApiResponse(
          HttpStatus.OK,
          SUCCESS_RESPONSE,
          NO_DATA_FOUND,
        );
      }
    } catch (error) {
      return createApiResponse(
        HttpStatus.BAD_REQUEST,
        FAIELD_RESPONSE,
        SOMETHING_WENT_WRONG,
        error,
      );
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.BotModel.findById(id).exec();
      if (data) {
        return createApiResponse(
          HttpStatus.OK,
          SUCCESS_RESPONSE,
          DATA_FOUND,
          data,
        );
      } else {
        return createApiResponse(
          HttpStatus.NOT_FOUND,
          SUCCESS_RESPONSE,
          NO_DATA_FOUND,
        );
      }
    } catch (error) {
      return createApiResponse(
        HttpStatus.BAD_REQUEST,
        FAIELD_RESPONSE,
        SOMETHING_WENT_WRONG,
        error,
      );
    }
  }

  async update(
    id: string,
    updateBotDto: UpdateBotDto,
  ) {
    try {
      const data = await this.BotModel
        .findByIdAndUpdate(id, updateBotDto, { new: true })
        .exec();

      // Restart Bot
      await this.handleStartBot(data._id);
      return createApiResponse(
        HttpStatus.OK,
        SUCCESS_RESPONSE,
        DATA_FOUND,
        data,
      );
    } catch (error) {
      return createApiResponse(
        HttpStatus.BAD_REQUEST,
        FAIELD_RESPONSE,
        SOMETHING_WENT_WRONG,
        error,
      );
    }
  }


  async updateBotToken(id: string, updateBotTokenDto: UpdateBotTokenDto) {
    try {
      let stopBot = await this.handleStopBot(id);
      if (stopBot.statusCode != HttpStatus.ACCEPTED || stopBot.message != "Worker Not Found") {
        return stopBot;
      }

      return await this.update(id, updateBotTokenDto);



    } catch (error) {
      return createApiResponse(
        HttpStatus.BAD_REQUEST,
        FAIELD_RESPONSE,
        SOMETHING_WENT_WRONG,
        error,
      );
    }
  }

  async remove(id: string) {
    try {
      const data = await this.BotModel.findByIdAndDelete(id).exec();
      if (data) {
        return createApiResponse(
          HttpStatus.OK,
          SUCCESS_RESPONSE,
          DATA_FOUND,
          data,
        );
      }
      return createApiResponse(
        HttpStatus.NOT_FOUND,
        FAIELD_RESPONSE,
        NO_DATA_FOUND,
      );
    } catch (error) {
      return createApiResponse(
        HttpStatus.BAD_REQUEST,
        FAIELD_RESPONSE,
        SOMETHING_WENT_WRONG,
        error,
      );
    }
  }

}
