import { Types } from 'mongoose';
export class CreateWithdrawDto {
  _id: Types.ObjectId;
  status: number;
  site: Types.ObjectId;
  user: Types.ObjectId;
  amount: string;
  bank_account_name: string;
  bank_account_number: string;
  team: Types.ObjectId;
  created: Date;
  updated: Date;
}
