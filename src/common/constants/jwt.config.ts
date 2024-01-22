import {
  CoreConfigService,
  JWT_EXPIRES_IN,
  JWT_SECRECT_KEY,
} from '../config/core/core.service';

const config = new CoreConfigService();

export function getDefaultJwtConfig() {
  return {
    global: true,
    secret: config.get(JWT_SECRECT_KEY),
    signOptions: { expiresIn: config.get(JWT_EXPIRES_IN) },
  };
}
