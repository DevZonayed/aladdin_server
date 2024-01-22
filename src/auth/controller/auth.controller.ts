import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from "express";
import { AuthService } from '../service/auth.service';

import { AuthGuard } from 'src/common/guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateSystemAdministratorDto } from '../dto/create-system-administrator.dto';
import { UserLoginDto } from '../dto/user-login.dto';
import { userVerificationDto } from '../dto/user-verification.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/system-administrator')
  async createSystemAdministrator(
    @Body() createSystemAdministrator: CreateSystemAdministratorDto,
  ) {
    return await this.authService.createSystemAdministrator(
      createSystemAdministrator,
    );
  }


  @Post('/registration')
  async registration(
    @Body() createUserData: CreateUserDto,
  ) {
    return await this.authService.createUser(
      createUserData,
    );
  }

  @Post('/registration/verify/verificationcode')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async verifyVerificationCode(
    @Body() verificationData: userVerificationDto,
    @Req() request: Request
  ) {
    let verificationCode = verificationData.verificationCode;
    let userData: any = request["user"];
    return await this.authService.verifyRegCode(userData, verificationCode)
  }




  @Post('login')
  login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }

  @Post('reset-password')
  resetPassword() {
    return this.authService.resetPassword();
  }

  @Post('mail-verify/:token')
  async verifyToken(@Param('token') token: string) {
    return this.authService.verifyToken(token);
  }
}
