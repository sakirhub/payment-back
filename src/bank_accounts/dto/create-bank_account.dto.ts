import { Types } from 'mongoose';

export class CreateBankAccountDto {
  site: Types.ObjectId;
  team: Types.ObjectId;
  paymentmethods: Types.ObjectId;
  name: string;
  account_number: string;
  daily_limit: number;
  min_transfer_amount: number;
  max_transfer_amount: number;
  status: number;
  tc: string;
  password: string;
  types: {
    user_name: string;
    amount: number;
    last_balance: string;
    created_bank: string;
    created: Date;
  }[];
  details: {
    user_name: string;
    amount: number;
    last_balance: string;
    created: Date;
  }[];
  logs: { timestamp: Date; message: string }[];
  created: Date;
  updated: Date;
  deleted: Date;
}
