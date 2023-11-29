import { IsOptional } from 'class-validator';
import { ApiAcceptedResponse, ApiProperty } from '@nestjs/swagger';
@ApiAcceptedResponse()
export class CreateDepositDto {
  @ApiProperty({
    type: 'string',
    example: 'f78ca536e0da8fc1c06803a47c7a2f23d7b8ede0',
  })
  access_token: string;
  @ApiProperty({
    type: 'string',
    example: '100',
  })
  amount: number;
  @ApiProperty({
    type: 'string',
    example: '650bb648d7e5dc080bcd2598',
  })
  payment_method: string;
  @ApiProperty({
    type: 'string',
    example: 't-1234567890',
  })
  transaction_id: string;
  @ApiProperty({
    type: 'object',
    properties: {
      user_id: {
        type: 'string',
        example: 'u-1234567890',
      },
      user_name: {
        type: 'string',
        example: 'john.doe',
      },
      user_full_name: {
        type: 'string',
        example: 'John Doe',
      },
    },
  })
  user: {
    user_id: string;
    user_name: string;
    user_full_name: string;
  };
  @IsOptional()
  team: string;
}
