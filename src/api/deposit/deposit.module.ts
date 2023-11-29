import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Investment, InvestmentSchema } from '../../schemas/investments.schema';
import { Site, SiteSchema } from '../../schemas/sites.schema';
import { Investor, InvestorSchema } from '../../schemas/investors.schema';
import { VerifyModule } from './verify/verify.module';
import {
  PaymentMethod,
  PaymentMethodSchema,
} from '../../schemas/payment_methods.schema';
import {
  BankAccount,
  BankAccountSchema,
} from '../../schemas/bank_account.schema';
import {Team, TeamSchema} from "../../schemas/teams.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Investment.name, schema: InvestmentSchema },
      { name: Site.name, schema: SiteSchema },
      { name: Investor.name, schema: InvestorSchema },
      { name: PaymentMethod.name, schema: PaymentMethodSchema },
      { name: BankAccount.name, schema: BankAccountSchema },
      { name: Team.name, schema: TeamSchema },
    ]),
    VerifyModule,
  ],
  controllers: [DepositController],
  providers: [DepositService],
})
export class DepositModule {}
