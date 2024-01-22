import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @ApiProperty({ example: 'devjonayed320@gmail.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}
