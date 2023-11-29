import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Site extends Document {
  @Prop({ index: true })
  name: string;
  @Prop()
  callback_url: string;
  @Prop()
  telegram_bot_token: string;
  @Prop()
  telegram_chat_id: string;
  @Prop()
  auto_bank_transfer_chat_id: string;
  @Prop()
  manual_bank_transfer_chat_id: string;
  @Prop({ index: true })
  access_token: string;
  @Prop()
  commission: string;
  @Prop()
  created: Date;
  @Prop()
  updated: Date;
}

export const SiteSchema = SchemaFactory.createForClass(Site);
