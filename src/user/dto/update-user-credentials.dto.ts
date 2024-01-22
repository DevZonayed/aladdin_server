import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserCredentialsDto {
    @ApiProperty({ example: 'sajgcfbvkas: Please enter valid api key' })
    apiKey: string;

    @ApiProperty({ example: 'jsacvhdbsekhv:Please enter valid api secret' })
    apiSecret: string;
}
