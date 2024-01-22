import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../common/enum/enum-user-role';

export class CreateSystemAdministratorDto {
  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: 'devjonayed320@gmail.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ example: '1234567890' })
  mobileNumber: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      enum: Object.values(UserRole),
      example: UserRole.SYSTEM_ADMINISTRATOR,
    },
    description: 'Roles assigned to the user',
  })
  roles: UserRole[];
}
