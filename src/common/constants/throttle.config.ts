import {
  CoreConfigService,
  THROTTLER_LONG_LIMIT,
  THROTTLER_LONG_NAME,
  THROTTLER_LONG_TTL,
  THROTTLER_MEDIUM_LIMIT,
  THROTTLER_MEDIUM_NAME,
  THROTTLER_MEDIUM_TTL,
  THROTTLER_SHORT_LIMIT,
  THROTTLER_SHORT_NAME,
  THROTTLER_SHORT_TTL,
} from '../config/core/core.service';

const config = new CoreConfigService();

export function getThroTTLconfig() {
  const formattedConfig = [
    {
      name: config.get(THROTTLER_SHORT_NAME),
      ttl: Number(config.get(THROTTLER_SHORT_TTL)),
      limit: Number(config.get(THROTTLER_SHORT_LIMIT)),
    },
    {
      name: config.get(THROTTLER_MEDIUM_NAME),
      ttl: Number(config.get(THROTTLER_MEDIUM_TTL)),
      limit: Number(config.get(THROTTLER_MEDIUM_LIMIT)),
    },
    {
      name: config.get(THROTTLER_LONG_NAME),
      ttl: Number(config.get(THROTTLER_LONG_TTL)),
      limit: Number(config.get(THROTTLER_LONG_LIMIT)),
    },
  ];

  return formattedConfig;
}
