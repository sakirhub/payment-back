import { Module } from '@nestjs/common';
import { BankAccountsService } from './bank_accounts.service';
import { BankAccountsController } from './bank_accounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BankAccount, BankAccountSchema } from '../schemas/bank_account.schema';
import { Site, SiteSchema } from '../schemas/sites.schema';
import {
  PaymentMethod,
  PaymentMethodSchema,
} from '../schemas/payment_methods.schema';
import { Team, TeamSchema } from '../schemas/teams.schema';
import { Investment, InvestmentSchema } from '../schemas/investments.schema';
import { Investor, InvestorSchema } from 'src/schemas/investors.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Site.name, schema: SiteSchema },
      { name: BankAccount.name, schema: BankAccountSchema },
      { name: PaymentMethod.name, schema: PaymentMethodSchema },
      { name: Team.name, schema: TeamSchema },
      { name: Investment.name, schema: InvestmentSchema },
      { name: Investor.name, schema: InvestorSchema },
    ]),
  ],

  providers: [BankAccountsService],
  controllers: [BankAccountsController],
})
export class BankAccountsModule {}
