import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BinanceService } from 'src/binance/service/binance.service';
import { ASSET_NOT_ALLOWED, DATA_FOUND, FAIELD_RESPONSE, NO_CREDENTIALS_DATA_FOUND, NO_DATA_FOUND, SOMETHING_WENT_WRONG, STRATEGY_CREATED_FAILED, STRATEGY_CREATED_SUCCESSFULLY, SUCCESS_RESPONSE, createApiResponse } from 'src/common/constants';
import { SortBy } from 'src/common/enum/enum-sort-by';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/service/user.service';
import { CreateStrategyDto } from '../dto/create-strategy.dto';
import { OrderWebHookDto } from '../dto/order_webhook-dto';
import { UpdateStrategyDto } from '../dto/update-strategy.dto';
import { Strategy } from '../entities/strategy.entity';

@Injectable()
export class StrategyService {
  constructor(
    @InjectModel(Strategy.name) private readonly StrategyModel: Model<Strategy>,
    @Inject(forwardRef(() => BinanceService)) private readonly binanceService: BinanceService,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
  ) { }

  async create(
    createStrategyDto: CreateStrategyDto,
  ) {
    try {
      const createStrategy = new this.StrategyModel(
        createStrategyDto,
      );
      await createStrategy.save();
      return createApiResponse(
        HttpStatus.CREATED,
        SUCCESS_RESPONSE,
        STRATEGY_CREATED_SUCCESSFULLY,
        createStrategy,
      );
    } catch (err) {
      return createApiResponse(
        HttpStatus.CONFLICT,
        FAIELD_RESPONSE,
        STRATEGY_CREATED_FAILED,
        err.message,
      );
    }
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

      pipeline.push(
        { $skip: startIndex },
        { $limit: parseInt(limit.toString(), 10) },
      );

      const sortStage: any = {};
      sortStage[order] = sort === 'desc' ? -1 : 1;
      pipeline.push({ $sort: sortStage });

      const data = await this.StrategyModel.aggregate(pipeline);

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
      const data = await this.StrategyModel.findById(id).exec();
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


  async findBySlug(slug: string) {
    try {
      const data = await this.StrategyModel.findOne({ apiSlug: slug }).exec();
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
    updateStrategyDto: UpdateStrategyDto,
  ) {
    try {
      const data = await this.StrategyModel
        .findByIdAndUpdate(id, updateStrategyDto, { new: true })
        .exec();
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

  async remove(id: string) {
    try {
      const data = await this.StrategyModel.findByIdAndDelete(id).exec();
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

  async handleWebHook(endPoint: string, order: OrderWebHookDto) {
    try {

      console.table({
        endPoint,
        order,
      })

      let strategy = await this.StrategyModel.findOne({ apiSlug: endPoint })
      if (!strategy) {
        return createApiResponse(
          HttpStatus.NOT_FOUND,
          FAIELD_RESPONSE,
          NO_DATA_FOUND,
          [],
        );
      }

      const credentials: User[] = await this.userService.getCredentialsOfStrategy(strategy._id)
      if (credentials.length === 0) {
        return createApiResponse(
          HttpStatus.NOT_FOUND,
          FAIELD_RESPONSE,
          NO_CREDENTIALS_DATA_FOUND,
          [],
        );
      }

      // Handle Allow and banned assets protection
      const allowAssets = strategy?.allowAssets || null
      const bannedAssets = strategy?.bannedAssets || null
      if (allowAssets && allowAssets.length > 0) {
        let symbol = order?.symbol?.toUpperCase() || "";
        if (!allowAssets.includes(symbol)) {
          return createApiResponse(
            HttpStatus.CONTINUE,
            FAIELD_RESPONSE,
            ASSET_NOT_ALLOWED,
            [],
          );
        }
      } else if (bannedAssets && bannedAssets.length > 0) {
        let symbol = order?.symbol?.toUpperCase() || "";
        if (bannedAssets.includes(symbol)) {
          return createApiResponse(
            HttpStatus.CONTINUE,
            FAIELD_RESPONSE,
            ASSET_NOT_ALLOWED,
            [],
          );
        }
      }


      return await this.binanceService.createStrategyOrders(strategy, credentials, order)

    } catch (err) {
      return createApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        FAIELD_RESPONSE,
        SOMETHING_WENT_WRONG,
        err.message,
      );
    }

  }
}
