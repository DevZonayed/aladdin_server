import { ApiProperty } from '@nestjs/swagger';
import { PositionTypeEnum } from 'src/binance/enum/BinanceEnum';

export class CreateStrategyDto {

  @ApiProperty({
    type: String,
    description: 'Name of the Strategy',
    example: 'Demo Strategy',
    required: true,
  })
  readonly StrategyName: string;


  @ApiProperty({
    type: String,
    description: 'Description of the Strategy',
    example: 'This strategy will work with multiple coins and reEntry',
  })
  readonly description: string;

  @ApiProperty({
    type: String,
    description: 'Banned Assets, That you not to order',
    example: [],
  })
  readonly bannedAssets: string[];


  @ApiProperty({
    type: String,
    description: 'Allowed Assets, that you only wanna order on',
    example: [],
  })
  readonly allowAssets: string[];

  @ApiProperty({
    type: String,
    description: 'Api Endpoint of the strategy',
    example: "demo-1",
    required: true
  })
  readonly apiSlug: string;


  @ApiProperty({
    type: Number,
    description: 'Capital amount of the strategy to calculate',
    example: 1000,
    required: true
  })
  readonly capital: number;

  @ApiProperty({
    type: String,
    description: 'Order type for new order',
    example: PositionTypeEnum.LIMIT,
    required: true,
  })

  readonly newOrderType: string;
  @ApiProperty({
    type: String,
    description: 'Order type for partial Entry',
    example: PositionTypeEnum.LIMIT,
    required: true,
  })
  readonly partialOrderType: string;


  @ApiProperty({
    type: Number,
    description: 'Required capital for subscribe this strategy',
    example: 1000,
    required: true
  })
  readonly minimumCapitalToSubscribe: number;

  @ApiProperty({
    type: Number,
    description: 'Maximum amount for per trade',
    example: 200,
    required: true
  })
  readonly tradeMaxAmountPercentage: number;

  @ApiProperty({
    type: Number,
    description: 'Maximum leverage for per trade',
    example: 10,
    required: true
  })
  readonly tradeMaxLeverage: number;

  @ApiProperty({
    type: Boolean,
    description: 'Is this strategy work with re entry',
    example: true
  })
  readonly reEntry: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Should it apply with stop loss also',
    example: true
  })
  readonly stopLoss: boolean;

  @ApiProperty({
    type: Number,
    description: 'What should be the maximum lose percentage',
    example: 100
  })
  readonly stopLossPercentage: number;

  @ApiProperty({
    type: String,
    description: 'ID of the user who created the bucket category',
    example: '60c6e2349a0cdc40f8b5f4d2',
  })
  readonly createdBy: string;
}
