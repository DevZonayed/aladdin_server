import {
  CoreConfigService,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  MONGO_URI_PREFIX,
} from '../config/core/core.service';

const config = new CoreConfigService();

export function getDefaultDbConnectionString(): string {
  const mongoUriPrefix = config.get(MONGO_URI_PREFIX) || 'mongodb';
  const mongoOptions = {
    // authSource: 'admin',
  };

  const formattedOptions = Object.entries(mongoOptions)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  // Build connection parts
  let authPart = '';
  const user = config.get(DB_USER);
  const password = config.get(DB_PASSWORD);
  if (user && password) {
    authPart = `${user}:${password}@`;
  }

  let hostPart = config.get(DB_HOST) || 'localhost';
  let portPart = config.get(DB_PORT);
  if (portPart) {
    portPart = `:${portPart}`;
  } else {
    portPart = '';
  }

  const dbName = config.get(DB_NAME) || 'test';

  const connectionString = `${mongoUriPrefix}://${authPart}${hostPart}${portPart}/${dbName}?${formattedOptions}`;

  return connectionString;
}
