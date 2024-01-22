import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class SubUnsubStrategyDto {
    @ApiProperty({ example: '65ae2da5d1509f2489903a0f' })
    strategyId: Types.ObjectId;
}
