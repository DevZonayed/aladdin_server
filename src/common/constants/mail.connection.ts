import {
  CoreConfigService,
  MAIL_HOST,
  MAIL_IGNORE_TLS,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_SECURE,
  MAIL_SENDER_NAME,
  MAIL_USER,
} from '../config/core/core.service';

const config = new CoreConfigService();

export function getDefaultMailConnectionConfig() {
  return {
    transport: {
      host: config.get(MAIL_HOST),

      port: config.get(MAIL_PORT),
      ignoreTLS: config.get(MAIL_IGNORE_TLS),
      secure: config.get(MAIL_SECURE),
      auth: {
        user: config.get(MAIL_USER),
        pass: config.get(MAIL_PASSWORD),
      },
    },
    defaults: {
      from: `${config.get(MAIL_SENDER_NAME)} <${config.get(MAIL_USER)}>`,
    },
  };
}
