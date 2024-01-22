import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../common/enum/enum-order-status';
import { PaymentAccountType } from '../../common/enum/enum-payment-account-type';
import { PaymentStatus } from '../../common/enum/enum-payment-status';

export class CreateOrderDto {
  @ApiProperty({
    type: String,
    description: 'ID of the user who placed the order',
    example: '60c6e2349a0cdc40f8b5f4d2',
    required: true,
  })
  readonly orderBy: string;

  @ApiProperty({
    type: String,
    description: 'ID of the surprised bucket in the order',
    example: '60c6e2349a0cdc40f8b5f4d3',
    required: true,
  })
  readonly bucketName: string;

  @ApiProperty({
    type: String,
    description: 'ID of the restaurant for the order',
    example: '60c6e2349a0cdc40f8b5f4d4',
    required: true,
  })
  readonly restaurant: string;

  @ApiProperty({
    type: Number,
    description: 'Quantity of items in the order',
    example: 2,
  })
  readonly qty: number;

  @ApiProperty({
    type: Number,
    description: 'Unit amount for each item',
    example: 10,
  })
  readonly amount: number;

  @ApiProperty({
    type: String,
    description: 'Type of payment account',
    enum: PaymentAccountType,
    example: PaymentAccountType.STRIPE,
  })
  readonly paymentAccountType: string;

  @ApiProperty({
    type: String,
    description: 'Payment status of the order',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  readonly paymentStatus: string;

  @ApiProperty({
    type: String,
    description: 'Status of the order',
    enum: OrderStatus,
    example: OrderStatus.SUCCESS,
  })
  readonly orderStatus: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the order is refundable',
    example: true,
  })
  readonly isRefundable: boolean;

  @ApiProperty({
    type: String,
    description: 'Transaction ID for the order',
    example: 'txn_12345',
  })
  readonly transactionID: string;
}
