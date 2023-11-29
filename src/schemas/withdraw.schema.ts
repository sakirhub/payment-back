import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema()
export class Withdraw extends Document {
  @Prop()
  status: number;
  @Prop({ type: Types.ObjectId, ref: 'Sites' })
  site: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Investors' })
  user: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Teams' })
  team: Types.ObjectId;
  @Prop()
  amount: string;
  @Prop()
  bank_account_name: string;
  @Prop()
  bank_account_number: string;
  @Prop({ type: Date, default: Date.now })
  created: Date;
  @Prop({ type: Date })
  updated: Date;
}

export const WithdrawSchema = SchemaFactory.createForClass(Withdraw);
