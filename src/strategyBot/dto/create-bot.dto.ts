import { ApiProperty } from '@nestjs/swagger';

export class CreateBotDto {

  @ApiProperty({
    type: String,
    description: 'Name of the Bot',
    example: 'Demo Bot',
    required: true,
  })
  readonly BotName: string;


  @ApiProperty({
    type: String,
    description: 'Description of the Bot',
    example: 'This Bot will work with multiple coins and reEntry',
  })
  readonly description: string;

  @ApiProperty({
    type: [String],
    description: 'The Stratefy Slug that you want to add on this bot',
    example: ["demo-1"],
  })
  readonly strategySlugs: string[];

  @ApiProperty({
    type: String,
    description: 'The Id of the Binance Strategy ID',
    example: "545543434",
  })
  readonly strategyId: string;

  @ApiProperty({
    type: String,
    description: 'P20t token',
    example: "545543434",
  })
  readonly p20t: string;

  @ApiProperty({
    type: String,
    description: 'P2ot token',
    example: "545543434",
  })
  readonly csrfToken: string;

  @ApiProperty({
    type: Number,
    description: 'Scrap Interval',
    example: 5000,
  })
  readonly scrapInterval: number;


  @ApiProperty({
    type: Boolean,
    description: 'Is the strategy of b is Public?',
    example: true,
    required: true
  })
  readonly isPublic: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Runnig Order Of this bot?',
    example: 0,
  })
  readonly runningOrders: number;
}
