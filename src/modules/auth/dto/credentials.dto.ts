import { ApiProperty } from "@nestjs/swagger";
export class CredentialsDto {
  @ApiProperty({type:"string",format:"email"})
  email: string;
  @ApiProperty({type:"string",minLength:8})
  password: string;
}