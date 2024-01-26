import { ApiProperty } from '@nestjs/swagger';

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
    type: Boolean,
    description: 'Is the leverage should isolated or not',
    example: false,
    required: true,
  })
  readonly isolated: boolean;
}
