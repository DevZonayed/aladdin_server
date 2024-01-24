import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { BinanceService } from 'src/binance/service/binance.service';
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
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private readonly binanceService: BinanceService
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

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: any, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
      const result = await this.binanceService.checkBalance(updateBinanceCredentialsDto.apiKey, updateBinanceCredentialsDto.apiSecret);
      if (!result) {
        throw new Error(INVALID_BINANCE_CREDENTIALS);
      }

      const data = await this.userModel
        .findByIdAndUpdate(id, { binanceCredentials: updateBinanceCredentialsDto }, { new: true })
        .exec();
      return createApiResponse(
        HttpStatus.OK,
        SUCCESS_RESPONSE,
        DATA_FOUND,
        data,
      );
    } catch (error) {
      console.error(error);
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
            binanceCredentials: 1
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
