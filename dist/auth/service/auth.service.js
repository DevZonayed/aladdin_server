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
exports.AuthService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const core_service_1 = require("../../common/config/core/core.service");
const create_api_response_1 = require("../../common/constants/create-api.response");
const message_response_1 = require("../../common/constants/message.response");
const user_service_1 = require("../../user/service/user.service");
let AuthService = class AuthService {
    constructor(userService, jwtService, mailService, config) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.config = config;
    }
    login(userLoginDto) {
        return this.userService.login(userLoginDto);
    }
    async createUser(createUserData) {
        try {
            const userExist = await this.userService.checkUserByEmail(createUserData.email);
            if (userExist.length === 0) {
                return await this.sendUserRegistrationVerificationCodeMail(createUserData);
            }
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.CONFLICT, message_response_1.FAIELD_RESPONSE, message_response_1.USER_ALREADY_EXIST);
        }
        catch (err) {
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.INTERNAL_SERVER_ERROR, message_response_1.FAIELD_RESPONSE, message_response_1.AN_ERROR_OCCURED_WHILE_SAVING_DATA);
        }
    }
    async verifyRegCode(verificationData, code) {
        try {
            let { verificationCode, ...restData } = verificationData;
            let userData = restData;
            if (+verificationCode === +code) {
                return await this.userService.createUser(userData);
            }
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.EXPECTATION_FAILED, message_response_1.FAIELD_RESPONSE, message_response_1.VERIFICATION_MISMATCHED);
        }
        catch (err) {
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.INTERNAL_SERVER_ERROR, message_response_1.FAIELD_RESPONSE, message_response_1.AN_ERROR_OCCURED_WHILE_SAVING_DATA);
        }
    }
    async createSystemAdministrator(createSystemAdministrator) {
        try {
            const userExist = await this.userService.checkSystemAdministratorUser(createSystemAdministrator);
            if (userExist.length === 0) {
                return await this.sendSystemAdministratorVerificationMail(createSystemAdministrator);
            }
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.CONFLICT, message_response_1.FAIELD_RESPONSE, message_response_1.USER_ALREADY_EXIST);
        }
        catch (err) {
            console.log(err);
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.CONFLICT, message_response_1.FAIELD_RESPONSE, message_response_1.USER_ALREADY_EXIST, err.message);
        }
    }
    async verifyToken(token) {
        try {
            const verifyResponse = await this.tokenVerification(token);
            if (verifyResponse) {
                return await this.userService.createSystemAdministrator(verifyResponse);
            }
        }
        catch (error) {
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.EXPECTATION_FAILED, message_response_1.FAIELD_RESPONSE, message_response_1.VERIFICATION_TIME_EXPIRED);
        }
    }
    resetPassword() {
        return 'This action adds a new auth';
    }
    async tokenVerification(token) {
        return await this.jwtService.verifyAsync(token, {
            secret: this.config.get(core_service_1.JWT_SECRECT_KEY),
        });
    }
    async sendUserRegistrationVerificationCodeMail(createUserData) {
        try {
            const verificationCode = Math.floor(1000 + Math.random() * 9000);
            let payload = {
                fullName: createUserData.fullName,
                roles: createUserData.roles,
                email: createUserData.email,
                password: createUserData.password,
            };
            await this.mailService.sendMail({
                to: createUserData.email,
                subject: 'Registration Verification',
                text: 'Registration Verification mail',
                html: `
          <p>Hi there!</p>
          <p>Please verify your registration using this code below:</p>
          <b>${verificationCode}</b>
        `,
            });
            let access_token_payload = { ...payload, verificationCode };
            const access_token = await this.jwtService.sign(access_token_payload, {
                expiresIn: '300s',
            });
            let response_payload = {
                ...payload,
                access_token
            };
            return await (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.ACCEPTED, message_response_1.SUCCESS_RESPONSE, message_response_1.VERIFICATION_MAIL_SENT_SUCCESSFULLY, response_payload);
        }
        catch (err) {
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.INTERNAL_SERVER_ERROR, message_response_1.FAIELD_RESPONSE, message_response_1.FAIELD_TO_SEND_VERIFICATION_MAIL);
        }
    }
    async sendSystemAdministratorVerificationMail(createSystemAdministrator) {
        try {
            const createSystemAdministratorExist = await this.userService.checkUserByEmail(createSystemAdministrator.email);
            if (createSystemAdministratorExist.length > 0) {
                return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.CONFLICT, message_response_1.FAIELD_RESPONSE, message_response_1.USER_ALREADY_EXIST);
            }
            const payload = {
                fullName: createSystemAdministrator.fullName,
                roles: createSystemAdministrator.roles,
                email: createSystemAdministrator.email,
                password: createSystemAdministrator.password,
            };
            const access_token = await this.jwtService.sign(payload, {
                expiresIn: '300s',
            });
            await this.mailService.sendMail({
                to: createSystemAdministrator.email,
                subject: 'Registration Verification',
                text: 'Registration Verification mail',
                html: `
          <p>Hi there!</p>
          <p>Please verify your registration by clicking the link below:</p>
          <a href="${this.config.get(core_service_1.MAIL_VERIFICATION_HOST)}/auth-mail/verify?token=${access_token}">Verify Email</a>
        `,
            });
            return await (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.ACCEPTED, message_response_1.SUCCESS_RESPONSE, message_response_1.VERIFICATION_MAIL_SENT_SUCCESSFULLY, payload);
        }
        catch (error) {
            return (0, create_api_response_1.createApiResponse)(common_1.HttpStatus.INTERNAL_SERVER_ERROR, message_response_1.FAIELD_RESPONSE, message_response_1.FAIELD_TO_SEND_VERIFICATION_MAIL, error.message);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        mailer_1.MailerService,
        core_service_1.CoreConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map