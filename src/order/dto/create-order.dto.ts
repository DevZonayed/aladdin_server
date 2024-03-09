import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from '../enums/status.enum';

export class CreateOrderDto {
  @ApiProperty({
    type: String,
    description: 'Name of the symbol that you want to trade',
    example: 'SOLUSDT',
    required: true,
  })
  readonly symbol: string;

  @ApiProperty({
    type: String,
    description: 'Position side of your order',
    example: 'LONG',
    required: true,
  })
  readonly side: string;

  @ApiProperty({
    type: String,
    description: 'Order type of your position',
    example: 'LIMIT',
    required: true,
  })
  readonly type: string;

  @ApiProperty({
    type: Number,
    description: 'Quantity of your order assets',
    example: 5,
    required: true,
  })
  readonly quantity: number;

  @ApiProperty({
    type: Number,
    description: 'Limit Price of your order',
    example: 100,
    required: true,
  })
  readonly price: number;

  @ApiProperty({
    type: Number,
    description: 'Leverage of your order',
    example: 5,
    required: true,
  })
  readonly leverage: number;

  @ApiProperty({
    type: Number,
    description: 'Order Ratio to parent ratio',
    example: null,
  })
  readonly initialOrderRatio: number;

  @ApiProperty({
    type: Boolean,
    description: 'Is the leverage should isolated or not',
    example: false,
    required: true,
  })
  readonly isolated: boolean;

  @ApiProperty({
    type: Number,
    description: 'Number of reEntry',
    example: 0,
  })
  readonly reEntryCount: number;

  @ApiProperty({
    type: String,
    enum: StatusEnum,
    description: 'Status of the order',
    example: false,
    default: StatusEnum.OPEN
  })
  readonly status: StatusEnum;

  @ApiProperty({
    type: String,
    description: 'Reason for the order close',
    example: "",
  })
  readonly closeReason: string;
}
