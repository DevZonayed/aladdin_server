import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth/google')
@ApiTags('Google Auth')
export class GoogleAuthController {
  // api/auth/google/login
  @Get('login')
  @UseGuards(AuthGuard('google'))
  async handleGoogleAuth() {}

  // api/auth/google/redirect
  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return req.user;
  }
}
