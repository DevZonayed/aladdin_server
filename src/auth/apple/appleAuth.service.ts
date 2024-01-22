import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
import {
  APPLE_AUTH_REDIRECT,
  APPLE_CLIENT_ID,
  APPLE_KEY_ID,
  APPLE_PRIVATE_KEY,
  APPLE_TEAM_ID,
  CoreConfigService,
} from '../../common/config/core/core.service';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AppleAuthService extends PassportStrategy(Strategy, 'apple') {
  constructor(
    private readonly config: CoreConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: config.get(APPLE_CLIENT_ID),
      teamID: config.get(APPLE_TEAM_ID),
      keyID: config.get(APPLE_KEY_ID),
      privateKey: config.get(APPLE_PRIVATE_KEY),
      callbackURL: config.get(APPLE_AUTH_REDIRECT),
      scope: ['name', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    idToken: string,
    profile: any,
  ) {
    // User validation and data processing logic goes here
    return {
      id: profile.id,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
    };
  }
}
