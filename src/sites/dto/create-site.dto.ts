import { IsString, IsDate, IsOptional } from 'class-validator';

export class CreateSiteDto {
  @IsString()
  name: string;

  @IsString()
  callback_url: string;

  @IsString()
  telegram_bot_token: string;

  @IsString()
  telegram_chat_id: string;

  @IsString()
  auto_bank_transfer_chat_id: string;

  @IsString()
  manual_bank_transfer_chat_id: string;

  @IsString()
  access_token: string;

  @IsString()
  commission: string;

  @IsDate()
  @IsOptional()
  created: Date;

  @IsDate()
  @IsOptional()
  updated: Date;
}
