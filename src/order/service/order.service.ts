import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DATA_FOUND, FAIELD_RESPONSE, NO_DATA_FOUND, ORDER_CREATE_FAILED, ORDER_CREATE_SUCCESS, SOMETHING_WENT_WRONG, SUCCESS_RESPONSE, createApiResponse } from 'src/common/constants';
import { SortBy } from 'src/common/enum/enum-sort-by';
import { Order } from '../entities/order.entity';
import { StatusEnum } from '../enums/status.enum';


@Injectable()
export class OrderService {

  constructor(
    @InjectModel(Order.name)
    private readonly OrderModel: Model<Order>,
  ) {

  }
  async create(
    createOrderDto: any,
  ) {
    try {
      const createOrder = new this.OrderModel(
        createOrderDto,
      );
      await createOrder.save();
      return createApiResponse(
        HttpStatus.CREATED,
        SUCCESS_RESPONSE,
        ORDER_CREATE_SUCCESS,
        createOrder,
      );
    } catch (err) {
      return createApiResponse(
        HttpStatus.CONFLICT,
        FAIELD_RESPONSE,
        ORDER_CREATE_FAILED,
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

      pipeline.push(
        { $skip: startIndex },
        { $limit: parseInt(limit.toString(), 10) },
      );

      const sortStage: any = {};
      sortStage[order] = sort === 'desc' ? -1 : 1;
      pipeline.push({ $sort: sortStage });

      const data = await this.OrderModel.aggregate(pipeline);

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
      const data = await this.OrderModel.findById(id).exec();
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


  async findAllOpenOrders(strategyId: string, userId: string) {
    try {

      const data = await this.OrderModel.find({ status: StatusEnum.OPEN, strategyId, userId }).exec();
      if (data) {
        return {
          status: true,
          data,
        }
      } else {
        return {
          status: false,
          data,
        }
      }

    } catch (error) {
      return {
        status: false,
        error: "Failed to find open order" + error.message,
      }
    }
  }


  async findOpenOrder(strategyId: string, copyOrderId: string, userId: string, symbol: string, side: string) {
    try {
      const data = await this.OrderModel.findOne({ status: StatusEnum.OPEN, strategyId, copyOrderId, userId, side, symbol }).exec();
      if (data) {
        return {
          status: true,
          data,
        }
      } else {
        return {
          status: false,
          data,
        }
      }
    } catch (error) {
      return {
        status: false,
        error: "Failed to find open order" + error.message,
      }
    }
  }


  async update(
    id: string,
    updateOrderDto: any,
  ) {
    try {
      const data = await this.OrderModel
        .findByIdAndUpdate(id, updateOrderDto, { new: true })
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
      const data = await this.OrderModel.findByIdAndDelete(id).exec();
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
