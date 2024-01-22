import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import {
  CoreConfigService,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  FACEBOOK_AUTH_REDIRECT,
} from '../../common/config/core/core.service';
import { AuthService } from '../service/auth.service';

@Injectable()
export class FacebookAuthService extends PassportStrategy(
  Strategy,
  'facebook',
) {
  constructor(
    private readonly config: CoreConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: config.get(FACEBOOK_APP_ID),
      clientSecret: config.get(FACEBOOK_APP_SECRET),
      callbackURL: config.get(FACEBOOK_AUTH_REDIRECT),
      scope: 'email',
      profileFields: ['name', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // User validation and data processing logic goes here
    return {
      id: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
    };
  }
}
