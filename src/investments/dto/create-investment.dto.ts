export class CreateInvestmentDto {
  site_id: string;
  status: number;
  amount: number;
  payment_method: string;
  transaction_id: string;
  user: {
    user_id: string;
    user_name: string;
    user_first_name: string;
    user_last_name: string;
  };
}
