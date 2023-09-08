/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({ minLength: 3, maxLength: 20 })
  username: string;
  @ApiProperty({ format: 'email' })
  email: string;
  @ApiProperty({ minLength: 8 })
  password: string;
}
