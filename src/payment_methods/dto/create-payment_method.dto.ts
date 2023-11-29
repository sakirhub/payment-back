import { IsOptional } from 'class-validator';

export class CreatePaymentMethodDto {
  id: number;
  name: string;
  status: number;
  @IsOptional()
  logo: string;
}
