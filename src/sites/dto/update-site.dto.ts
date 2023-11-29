import { PartialType } from '@nestjs/mapped-types';
import { CreateSiteDto } from './create-site.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSiteDto extends PartialType(CreateSiteDto) {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  callback_url: string;
  @IsOptional()
  @IsString()
  telegram_bot_token: string;
  @IsOptional()
  @IsString()
  telegram_chat_id: string;
  @IsOptional()
  @IsString()
  auto_bank_transfer_chat_id: string;
  @IsOptional()
  @IsString()
  manual_bank_transfer_chat_id: string;
  @IsOptional()
  @IsString()
  access_token: string;
  @IsOptional()
  @IsString()
  commission: string;
}
