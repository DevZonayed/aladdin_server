import { MailerService } from '@nestjs-modules/mailer';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import {
  CoreConfigService,
  JWT_SECRECT_KEY,
  MAIL_VERIFICATION_HOST,
} from '../../common/config/core/core.service';
import { createApiResponse } from '../../common/constants/create-api.response';
import {
  AN_ERROR_OCCURED_WHILE_SAVING_DATA,
  FAIELD_RESPONSE,
  FAIELD_TO_SEND_VERIFICATION_MAIL,
  SUCCESS_RESPONSE,
  USER_ALREADY_EXIST,
  VERIFICATION_MAIL_SENT_SUCCESSFULLY,
  VERIFICATION_MISMATCHED,
  VERIFICATION_TIME_EXPIRED
} from '../../common/constants/message.response';
import { UserService } from '../../user/service/user.service';
import { CreateSystemAdministratorDto } from '../dto/create-system-administrator.dto';
import { UserLoginDto } from '../dto/user-login.dto';
import { userVerificationDto } from '../dto/user-verification.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
    private readonly config: CoreConfigService,
  ) { }

  login(userLoginDto: UserLoginDto) {
    return this.userService.login(userLoginDto);
  }

  async createUser(createUserData: CreateUserDto) {
    try {


      const userExist = await this.userService.checkUserByEmail(
        createUserData.email
      );

      if (userExist.length === 0) {
        return await this.sendUserRegistrationVerificationCodeMail(createUserData)
      }

      return createApiResponse(
        HttpStatus.CONFLICT,
        FAIELD_RESPONSE,
        USER_ALREADY_EXIST,
      );

    } catch (err) {
      return createApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        FAIELD_RESPONSE,
        AN_ERROR_OCCURED_WHILE_SAVING_DATA,
      );
    }
  }


  async verifyRegCode(verificationData: userVerificationDto, code: number) {
    try {
      let { verificationCode, ...restData } = verificationData;
      let userData: any = restData

      if (+verificationCode === +code) {
        return await this.userService.createUser(userData)
      }

      return createApiResponse(
        HttpStatus.EXPECTATION_FAILED,
        FAIELD_RESPONSE,
        VERIFICATION_MISMATCHED,
      );


    } catch (err) {
      return createApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        FAIELD_RESPONSE,
        AN_ERROR_OCCURED_WHILE_SAVING_DATA,
      );
    }


  }

  async createSystemAdministrator(
    createSystemAdministrator: CreateSystemAdministratorDto,
  ) {
    try {

      const userExist = await this.userService.checkSystemAdministratorUser(
        createSystemAdministrator,
      );

      if (userExist.length === 0) {
        return await this.sendSystemAdministratorVerificationMail(
          createSystemAdministrator,
        );
      }

      return createApiResponse(
        HttpStatus.CONFLICT,
        FAIELD_RESPONSE,
        USER_ALREADY_EXIST,
      );
    } catch (err) {
      console.log(err)
      return createApiResponse(
        HttpStatus.CONFLICT,
        FAIELD_RESPONSE,
        USER_ALREADY_EXIST,
        err.message
      );

    }
  }

  async verifyToken(token: string) {
    try {
      const verifyResponse = await this.tokenVerification(token);
      if (verifyResponse) {
        return await this.userService.createSystemAdministrator(verifyResponse);
      }
    } catch (error) {
      return createApiResponse(
        HttpStatus.EXPECTATION_FAILED,
        FAIELD_RESPONSE,
        VERIFICATION_TIME_EXPIRED,
      );
    }
  }

  resetPassword() {
    return 'This action adds a new auth';
  }

  async tokenVerification(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: this.config.get(JWT_SECRECT_KEY),
    });
  }



  async sendUserRegistrationVerificationCodeMail(createUserData: CreateUserDto) {

    try {

      const verificationCode = Math.floor(1000 + Math.random() * 9000);

      let payload = {
        fullName: createUserData.fullName,
        roles: createUserData.roles,
        email: createUserData.email,
        password: createUserData.password,
      }

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

      let access_token_payload = { ...payload, verificationCode }
      const access_token = await this.jwtService.sign(access_token_payload, {
        expiresIn: '300s',
      });

      let response_payload = {
        ...payload,
        access_token
      }

      return await createApiResponse(
        HttpStatus.ACCEPTED,
        SUCCESS_RESPONSE,
        VERIFICATION_MAIL_SENT_SUCCESSFULLY,
        response_payload,
      );

    } catch (err) {
      return createApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        FAIELD_RESPONSE,
        FAIELD_TO_SEND_VERIFICATION_MAIL,
      );
    }
  }


  async sendSystemAdministratorVerificationMail(
    createSystemAdministrator: CreateSystemAdministratorDto,
  ) {
    try {
      const createSystemAdministratorExist =
        await this.userService.checkUserByEmail(
          createSystemAdministrator.email,
        );

      if (createSystemAdministratorExist.length > 0) {
        return createApiResponse(
          HttpStatus.CONFLICT,
          FAIELD_RESPONSE,
          USER_ALREADY_EXIST,
        );
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
          <a href="${this.config.get(
          MAIL_VERIFICATION_HOST,
        )}/auth-mail/verify?token=${access_token}">Verify Email</a>
        `,
      });

      return await createApiResponse(
        HttpStatus.ACCEPTED,
        SUCCESS_RESPONSE,
        VERIFICATION_MAIL_SENT_SUCCESSFULLY,
        payload,
      );
    } catch (error) {
      return createApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        FAIELD_RESPONSE,
        FAIELD_TO_SEND_VERIFICATION_MAIL,
        error.message,
      );
    }
  }
}



