import { ApiProperty } from '@nestjs/swagger';
import {Types} from "mongoose";

export class CreateVerifyDto {
  @ApiProperty({
    type: 'string',
    example: 'f78ca536e0da8fc1c06803a47c7a2f23d7b8ede0',
  })
  access_token: string;
  @ApiProperty({
    type: 'string',
    example: 't-1234567890',
  })
  transaction_id: Types.ObjectId;
  @ApiProperty({
    type: 'string',
    example: 'b-1234567890',
  })
  bank_account_id: Types.ObjectId;
}
