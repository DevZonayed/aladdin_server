import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
export class CreateBinanceBotDto {

    @ApiProperty({
        type: String,
        description: 'Strategy account name',
        example: 'My Strategy Account',
        required: true,
    })
    readonly strategyAccauntName: string;

    @ApiProperty({
        type: Types.ObjectId,
        description: 'Strategy account ID',
        required: true,
    })
    readonly strategyAccaunt: Types.ObjectId;

    @ApiProperty({
        type: [String],
        description: 'Strategy slugs',
        example: ['strategy-slug-1', 'strategy-slug-2'],
    })
    readonly strategySlugs: string[];

    @ApiProperty({
        type: Boolean,
        description: 'Active status for each strategy slug',
        example: false,
    })
    readonly isActive: boolean;
}
