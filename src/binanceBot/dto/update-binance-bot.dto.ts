import { PartialType } from '@nestjs/swagger';
import { CreateBinanceBotDto } from './create-binance-bot.dto';

export class UpdateBinanceBotDto extends PartialType(CreateBinanceBotDto) { }
