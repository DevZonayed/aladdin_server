import { ApiProperty } from '@nestjs/swagger';

export class userVerificationDto {
    @ApiProperty({ example: '1234' })
    verificationCode: number;
}
