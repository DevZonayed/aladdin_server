import { ApiProperty } from '@nestjs/swagger';

export class UpdateBotTokenDto {

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
}
