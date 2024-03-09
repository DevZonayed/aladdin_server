import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { Model, Types } from 'mongoose';
import { BinanceService } from 'src/binance/service/binance.service';
import { SortBy } from 'src/common/enum/enum-sort-by';
import { UpdateUserCredentialsDto } from 'src/user/dto/update-user-credentials.dto';
import { CreateSystemAdministratorDto } from '../../auth/dto/create-system-administrator.dto';
import { UserLoginDto } from '../../auth/dto/user-login.dto';
import { createApiResponse } from '../../common/constants/create-api.response';
import {
  AN_ERROR_OCCURED_WHILE_SAVING_DATA,
  DATA_FOUND,
  FAIELD_RESPONSE,
  INVALID_BINANCE_CREDENTIALS,
  INVALID_PASSWORD,
  NO_DATA_FOUND,
  SOMETHING_WENT_WRONG,
  STRATEGY_SUBSCRIBED_SUCCESS,
  STRATEGY_UNSUBSCRIBED_SUCCESS,
  SUCCESS_RESPONSE,
  USER_ALREADY_EXIST,
  USER_CREATED_SUCCESSFULLY,
  USER_LOGIN_SUCCESSFUL,
  USER_MAIL_NOT_EXIST,
  USER_NOT_FOUND,
  YOU_ARE_ALREADY_SUBSCRIBED_TO_THIS_STRATEGY,
  YOU_ARE_NOT_SUBSCRIBED_TO_THIS_STRATEGY
} from '../../common/constants/message.response';
import { USER_BALANCE_CACHE_KEY } from '../cacheKeys/user.cache.keys';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(forwardRef(() => BinanceService)) private readonly binanceService: BinanceService,
    private jwtService: JwtService,

  ) { }

  async create(createUserDto: CreateUserDto) {

  }

  async createSystemAdministrator(
    createSystemAdministratorDto: CreateSystemAdministratorDto,
  ) {
    return await this.createSystemAdministratorUser(
      createSystemAdministratorDto,
    );
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email });
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
        const allFields = Object.keys(this.userModel.schema.obj);

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

      const totalResult = await this.userModel.aggregate(pipeline);
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

      const data = await this.userModel.aggregate(pipeline);

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
      const data = await this.userModel.findById(id).exec();
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
    updateUserDto: UpdateUserDto,
  ) {
    try {
      const data = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
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
      const data = await this.userModel.findByIdAndDelete(id).exec();
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


  async login(userLoginDto: UserLoginDto) {
    const userExist = await this.checkUserByEmail(userLoginDto.email);
    if (userExist.length > 0) {
      const matchPassword = await this.compareHashPassword(
        userLoginDto.password,
        userExist[0].password,
      );

      if (matchPassword) {
        const { access_token, data } = await this.getAccessToken(userExist[0]);

        return createApiResponse(
          HttpStatus.OK,
          SUCCESS_RESPONSE,
          USER_LOGIN_SUCCESSFUL,
          { access_token, data }, // Send user details in the payload
        );
      } else {
        return createApiResponse(
          HttpStatus.UNAUTHORIZED,
          FAIELD_RESPONSE,
          INVALID_PASSWORD,
        );
      }
    }
    return createApiResponse(
      HttpStatus.NOT_FOUND,
      FAIELD_RESPONSE,
      USER_MAIL_NOT_EXIST,
    );
  }

  async getBinanceBalance(id: Types.ObjectId | string, apiKey: string = null, apiSecret: string = null): Promise<{ balance: number | string, isTestMode: boolean }> {
    try {
      let cacheBalanceKey = USER_BALANCE_CACHE_KEY + id.toString()
      if (!apiKey || !apiSecret) {
        let cacheBalance: any = await this.cacheManager.get(cacheBalanceKey);
        if (cacheBalance?.balance) {
          return { balance: cacheBalance.balance, isTestMode: cacheBalance.isTestMode };
        }
      }

      const user = await this.userModel.findById(id).select(["binanceCredentials", "_id"]);
      if (user) {
        let _apiKey: string, _apiSecret: string;
        if (apiKey && apiSecret) {
          _apiKey = apiKey;
          _apiSecret = apiSecret;
        } else if (user?.binanceCredentials) {
          _apiKey = user.binanceCredentials.apiKey;
          _apiSecret = user.binanceCredentials.apiSecret;
        } else {
          throw new Error(INVALID_BINANCE_CREDENTIALS)
        }

        const binanceBalanceRes = await this.binanceService.checkBalance(_apiKey, _apiSecret);
        if (binanceBalanceRes.balance) {
          await this.cacheManager.set(cacheBalanceKey, { balance: binanceBalanceRes.balance, isTestMode: binanceBalanceRes.isTestMode },)
          return { balance: binanceBalanceRes.balance, isTestMode: binanceBalanceRes.isTestMode }
        } else {
          throw new Error(INVALID_BINANCE_CREDENTIALS)
        }
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async updateBinanceCredentials(id: string, updateBinanceCredentialsDto: UpdateUserCredentialsDto) {
    try {

      // Key Validations
      let credentialsKey = Object.keys(updateBinanceCredentialsDto);
      let credentialsDtoKeys = Object.keys(UpdateUserCredentialsDto);
      credentialsDtoKeys.forEach(key => {
        if (!credentialsKey.includes(key)) {
          throw new Error(`Invalid credentials of ${key}`);
        }
      });

      // Check Token validation
      const { balance, isTestMode } = await this.getBinanceBalance(id, updateBinanceCredentialsDto.apiKey, updateBinanceCredentialsDto.apiSecret);
      if (!balance) {
        throw new Error(INVALID_BINANCE_CREDENTIALS);
      }

      const data = await this.userModel
        .findByIdAndUpdate(id, { binanceCredentials: { ...updateBinanceCredentialsDto, isTestMode } }, { new: true })
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
        error.message,
      );
    }
  }

  async subscribeToStrategy(userId: string, strategyId: Types.ObjectId) {
    try {
      const user = await this.userModel.findById(userId);
      if (user) {
        const strategy = user.strategys?.find(strategy => strategy == strategyId);
        if (strategy) {
          return createApiResponse(
            HttpStatus.BAD_REQUEST,
            FAIELD_RESPONSE,
            YOU_ARE_ALREADY_SUBSCRIBED_TO_THIS_STRATEGY,
          );
        } else {
          let strategys = [];
          if (user.strategys) {
            strategys = [...user.strategys, strategyId]
          } else {
            strategys = [strategyId];
          }
          user.strategys = strategys;
          await user.save();
          return createApiResponse(
            HttpStatus.OK,
            SUCCESS_RESPONSE,
            STRATEGY_SUBSCRIBED_SUCCESS,
          );
        }
      } else {
        return createApiResponse(
          HttpStatus.BAD_REQUEST,
          FAIELD_RESPONSE,
          USER_NOT_FOUND,
        );
      }
    } catch (error) {
      return createApiResponse(
        HttpStatus.BAD_REQUEST,
        FAIELD_RESPONSE,
        SOMETHING_WENT_WRONG,
        error.message,
      );
    }
  }
  async unSubscribeToStrategy(userId: string, strategyId: Types.ObjectId) {
    try {
      const user = await this.userModel.findById(userId);
      if (user) {
        const index = user.strategys?.findIndex(id => id == strategyId);
        if (index > -1) {
          let strategys = user.strategys.filter(item => item != strategyId);
          user.strategys = strategys;
          await user.save();
          return createApiResponse(
            HttpStatus.OK,
            SUCCESS_RESPONSE,
            STRATEGY_UNSUBSCRIBED_SUCCESS
          );
        } else {
          return createApiResponse(
            HttpStatus.BAD_REQUEST,
            FAIELD_RESPONSE,
            YOU_ARE_NOT_SUBSCRIBED_TO_THIS_STRATEGY
          );
        }
      } else {
        return createApiResponse(
          HttpStatus.BAD_REQUEST,
          FAIELD_RESPONSE,
          USER_NOT_FOUND,
        );
      }
    } catch (error) {
      return createApiResponse(
        HttpStatus.BAD_REQUEST,
        FAIELD_RESPONSE,
        SOMETHING_WENT_WRONG,
        error.message,
      );
    }
  }

  async getCredentialsOfStrategy(strategyId: Types.ObjectId) {

    try {

      const pipeline = [
        {
          $match: {
            strategys: strategyId.toString()
          }
        },
        {
          $project: {
            _id: 1,
            binanceCredentials: 1,
          }
        }
      ];

      return await this.userModel.aggregate(pipeline).exec();

    } catch (err) {
      throw new Error(err.message);
    }
  }

  async checkUserByEmail(email) {
    return await this.userModel.find({ email });
  }
  async checkUserByRoles(roles) {
    return await this.userModel.find({ roles });
  }
  async hashPassword(password) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async compareHashPassword(password, userPassword) {
    return await bcrypt.compare(password, userPassword);
  }

  async getAccessToken(response) {
    const payload = {
      sub: (await response)._id,
      fullName: (await response).fullName,
      email: (await response).email,
      roles: (await response).roles,
    };
    const access_token = await this.jwtService.signAsync(payload);
    return { data: payload, access_token };
  }

  async checkSystemAdministratorUser(
    createSystemAdministrator: CreateSystemAdministratorDto,
  ) {
    return await this.checkUserByRoles(createSystemAdministrator.roles);
  }

  async createSystemAdministratorUser(
    createSystemAdministrator: CreateSystemAdministratorDto,
  ) {
    try {
      const userExist = await this.checkUserByEmail(
        createSystemAdministrator.email,
      );

      if (userExist.length > 0) {
        return createApiResponse(
          HttpStatus.CONFLICT,
          FAIELD_RESPONSE,
          USER_ALREADY_EXIST,
        );
      }

      const user = new this.userModel();
      const encryptedPassword = await this.hashPassword(
        createSystemAdministrator.password,
      );
      user.fullName = createSystemAdministrator.fullName;
      user.email = createSystemAdministrator.email;
      user.password = encryptedPassword;
      user.roles = createSystemAdministrator.roles;

      const response = await user.save();
      if (response) {
        const { data, access_token } = await this.getAccessToken(response);
        return createApiResponse(
          HttpStatus.CREATED,
          SUCCESS_RESPONSE,
          USER_CREATED_SUCCESSFULLY,
          { data, access_token },
        );
      }
    } catch (error) {
      return createApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        FAIELD_RESPONSE,
        AN_ERROR_OCCURED_WHILE_SAVING_DATA,
      );
    }
  }

  async createUser(createUserData: CreateUserDto) {
    try {
      const userExist = await this.checkUserByEmail(
        createUserData.email,
      );

      if (userExist.length > 0) {
        return createApiResponse(
          HttpStatus.CONFLICT,
          FAIELD_RESPONSE,
          USER_ALREADY_EXIST,
        );
      }

      const user = new this.userModel();
      const encryptedPassword = await this.hashPassword(
        createUserData.password,
      );
      user.fullName = createUserData.fullName;
      user.email = createUserData.email;
      user.password = encryptedPassword;
      user.roles = createUserData.roles;

      const response = await user.save();
      if (response) {
        const { data, access_token } = await this.getAccessToken(response);
        return createApiResponse(
          HttpStatus.CREATED,
          SUCCESS_RESPONSE,
          USER_CREATED_SUCCESSFULLY,
          { data, access_token },
        );
      }
    } catch (error) {
      return createApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        FAIELD_RESPONSE,
        AN_ERROR_OCCURED_WHILE_SAVING_DATA,
      );
    }
  }
}
