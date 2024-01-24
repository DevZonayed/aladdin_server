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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = require("bcrypt");
const mongoose_2 = require("mongoose");
const binance_service_1 = require("../../binance/service/binance.service");
const update_user_credentials_dto_1 = require("../dto/update-user-credentials.dto");
const create_api_response_1 = require("../../common/constants/create-api.response");
const message_response_1 = require("../../common/constants/message.response");
const user_entity_1 = require("../entities/user.entity");
let UserService = class UserService {
    constructor(userModel, jwtService, binanceService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.binanceService = binanceService;
    }
    async create(createUserDto) {
    }
    async createSystemAdministrator(createSystemAdministratorDto) {
        return await this.createSystemAdministratorUser(createSystemAdministratorDto);
    }
    async login(userLoginDto) {
        const userExist = await this.checkUserByEmail(userLoginDto.email);
        if (userExist.length > 0) {
            const matchPassword = await this.compareHashPassword(userLoginDto.password, userExist[0].password);
            if (matchPassword) {
                const { access_token, data } = await this.getAccessToken(userExist[0]);
                return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.OK, message_response_1.SUCCESS_RESPONSE, message_response_1.USER_LOGIN_SUCCESSFUL, { access_token, data });
            }
            else {
                return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.UNAUTHORIZED, message_response_1.FAIELD_RESPONSE, message_response_1.INVALID_PASSWORD);
            }
        }
        return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.NOT_FOUND, message_response_1.FAIELD_RESPONSE, message_response_1.USER_MAIL_NOT_EXIST);
    }
    findByEmail(email) {
        return this.userModel.findOne({ email: email });
    }
    findAll() {
        return `This action returns all user`;
    }
    findOne(id) {
        return `This action returns a #${id} user`;
    }
    update(id, updateUserDto) {
        return this.userModel.findByIdAndUpdate(id, updateUserDto);
    }
    remove(id) {
        return `This action removes a #${id} user`;
    }
    async updateBinanceCredentials(id, updateBinanceCredentialsDto) {
        try {
            let credentialsKey = Object.keys(updateBinanceCredentialsDto);
            let credentialsDtoKeys = Object.keys(update_user_credentials_dto_1.UpdateUserCredentialsDto);
            credentialsDtoKeys.forEach(key => {
                if (!credentialsKey.includes(key)) {
                    throw new Error(`Invalid credentials of ${key}`);
                }
            });
            const result = await this.binanceService.checkBalance(updateBinanceCredentialsDto.apiKey, updateBinanceCredentialsDto.apiSecret);
            if (!result) {
                throw new Error(message_response_1.INVALID_BINANCE_CREDENTIALS);
            }
            const data = await this.userModel
                .findByIdAndUpdate(id, { binanceCredentials: updateBinanceCredentialsDto }, { new: true })
                .exec();
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.OK, message_response_1.SUCCESS_RESPONSE, message_response_1.DATA_FOUND, data);
        }
        catch (error) {
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, message_response_1.FAIELD_RESPONSE, message_response_1.SOMETHING_WENT_WRONG, error.message);
        }
    }
    async subscribeToStrategy(userId, strategyId) {
        try {
            const user = await this.userModel.findById(userId);
            if (user) {
                const strategy = user.strategys?.find(strategy => strategy == strategyId);
                if (strategy) {
                    return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, message_response_1.FAIELD_RESPONSE, message_response_1.YOU_ARE_ALREADY_SUBSCRIBED_TO_THIS_STRATEGY);
                }
                else {
                    let strategys = [];
                    if (user.strategys) {
                        strategys = [...user.strategys, strategyId];
                    }
                    else {
                        strategys = [strategyId];
                    }
                    user.strategys = strategys;
                    await user.save();
                    return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.OK, message_response_1.SUCCESS_RESPONSE, message_response_1.STRATEGY_SUBSCRIBED_SUCCESS);
                }
            }
            else {
                return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, message_response_1.FAIELD_RESPONSE, message_response_1.USER_NOT_FOUND);
            }
        }
        catch (error) {
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, message_response_1.FAIELD_RESPONSE, message_response_1.SOMETHING_WENT_WRONG, error.message);
        }
    }
    async unSubscribeToStrategy(userId, strategyId) {
        try {
            const user = await this.userModel.findById(userId);
            if (user) {
                const index = user.strategys?.findIndex(id => id == strategyId);
                if (index > -1) {
                    let strategys = user.strategys.filter(item => item != strategyId);
                    user.strategys = strategys;
                    await user.save();
                    return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.OK, message_response_1.SUCCESS_RESPONSE, message_response_1.STRATEGY_UNSUBSCRIBED_SUCCESS);
                }
                else {
                    return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, message_response_1.FAIELD_RESPONSE, message_response_1.YOU_ARE_NOT_SUBSCRIBED_TO_THIS_STRATEGY);
                }
            }
            else {
                return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, message_response_1.FAIELD_RESPONSE, message_response_1.USER_NOT_FOUND);
            }
        }
        catch (error) {
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, message_response_1.FAIELD_RESPONSE, message_response_1.SOMETHING_WENT_WRONG, error.message);
        }
    }
    async getCredentialsOfStrategy(strategyId) {
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
        }
        catch (err) {
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
    async checkSystemAdministratorUser(createSystemAdministrator) {
        return await this.checkUserByRoles(createSystemAdministrator.roles);
    }
    async createSystemAdministratorUser(createSystemAdministrator) {
        try {
            const userExist = await this.checkUserByEmail(createSystemAdministrator.email);
            if (userExist.length > 0) {
                return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.CONFLICT, message_response_1.FAIELD_RESPONSE, message_response_1.USER_ALREADY_EXIST);
            }
            const user = new this.userModel();
            const encryptedPassword = await this.hashPassword(createSystemAdministrator.password);
            user.fullName = createSystemAdministrator.fullName;
            user.email = createSystemAdministrator.email;
            user.password = encryptedPassword;
            user.roles = createSystemAdministrator.roles;
            const response = await user.save();
            if (response) {
                const { data, access_token } = await this.getAccessToken(response);
                return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.CREATED, message_response_1.SUCCESS_RESPONSE, message_response_1.USER_CREATED_SUCCESSFULLY, { data, access_token });
            }
        }
        catch (error) {
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.INTERNAL_SERVER_ERROR, message_response_1.FAIELD_RESPONSE, message_response_1.AN_ERROR_OCCURED_WHILE_SAVING_DATA);
        }
    }
    async createUser(createUserData) {
        try {
            const userExist = await this.checkUserByEmail(createUserData.email);
            if (userExist.length > 0) {
                return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.CONFLICT, message_response_1.FAIELD_RESPONSE, message_response_1.USER_ALREADY_EXIST);
            }
            const user = new this.userModel();
            const encryptedPassword = await this.hashPassword(createUserData.password);
            user.fullName = createUserData.fullName;
            user.email = createUserData.email;
            user.password = encryptedPassword;
            user.roles = createUserData.roles;
            const response = await user.save();
            if (response) {
                const { data, access_token } = await this.getAccessToken(response);
                return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.CREATED, message_response_1.SUCCESS_RESPONSE, message_response_1.USER_CREATED_SUCCESSFULLY, { data, access_token });
            }
        }
        catch (error) {
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.INTERNAL_SERVER_ERROR, message_response_1.FAIELD_RESPONSE, message_response_1.AN_ERROR_OCCURED_WHILE_SAVING_DATA);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        binance_service_1.BinanceService])
], UserService);
//# sourceMappingURL=user.service.js.map