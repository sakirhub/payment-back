import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Investor extends Document {
  @Prop()
  user_id: string;
  @Prop()
  user_name: string;
  @Prop()
  user_first_name: string;
  @Prop()
  user_last_name: string;
  @Prop()
  user_full_name: string;
  @Prop()
  safe: number;
  @Prop({ type: Types.ObjectId, ref: 'Site' })
  site: Types.ObjectId;
  @Prop({ type: Date, default: Date.now })
  created: Date;
}
export const InvestorSchema = SchemaFactory.createForClass(Investor);
