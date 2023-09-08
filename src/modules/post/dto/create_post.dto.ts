import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ type: String, required: true, maxLength: 50 })
  title: string;
  @ApiProperty({ type: String, required: true, maxLength: 300 })
  content: string;
}
