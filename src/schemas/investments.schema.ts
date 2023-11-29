import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Investment {
  @Prop({ type: Types.ObjectId, ref: 'Site' })
  site: Types.ObjectId;
  @Prop({ index: true })
  status: number;
  @Prop()
  amount: number;
  @Prop({ type: Types.ObjectId, ref: 'PaymentMethod' })
  payment_method: Types.ObjectId;
  @Prop()
  transaction_id: string;
  @Prop({ type: Types.ObjectId, ref: 'Investor' })
  user: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Team' })
  team: Types.ObjectId;
  team_name: string;
  @Prop({ type: Types.ObjectId, ref: 'BankAccount' })
  bank_account: Types.ObjectId;
  name: string;
  @Prop({ type: [{ timestamp: Date, message: String }] })
  logs: { timestamp: Date; message: string }[];
  @Prop({ type: Date, default: Date.now })
  created: Date;
  @Prop({ type: Date })
  updated: Date;
}

export const InvestmentSchema = SchemaFactory.createForClass(Investment);
