import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema()
export class BankAccount extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Site' })
  site: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Team' })
  team: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'PaymentMethod' })
  paymentmethods: Types.ObjectId;
  @Prop()
  name: string;
  @Prop()
  account_number: string;
  @Prop()
  daily_limit: number;
  @Prop()
  min_transfer_amount: number;
  @Prop()
  max_transfer_amount: number;
  @Prop()
  status: number;
  @Prop()
  chat_id: string;
  @Prop()
  tc: string;
  @Prop()
  password: string;
  @Prop({
    type: [
      {
        user_name: String,
        normalize_user: String,
        amount: Number,
        last_balance: String,
        created_bank: String,
        created: {
          type: Date,
          default: Date.now,
        },
        investment_id: {
          type: Types.ObjectId,
          ref: 'Investment',
        },
      },
    ],
  })
  details: {
    _id: Types.ObjectId;
    user_name: string;
    normalize_user: string;
    amount: number;
    last_balance: string;
    created_bank: string;
    created: Date;
    investment_id: null | Types.ObjectId;
  }[];
  @Prop({ type: [{ timestamp: Date, message: String }] })
  logs: { timestamp: Date; message: string }[];
  @Prop()
  login: number;
  @Prop()
  login_user: number;
  @Prop()
  login_username: string;
  @Prop()
  resume: number;
  @Prop({ type: Date, default: Date.now })
  created: Date;
  @Prop({ type: Date })
  updated: Date;
  @Prop({ type: Date })
  deleted: Date;
}

export const BankAccountSchema = SchemaFactory.createForClass(BankAccount);
