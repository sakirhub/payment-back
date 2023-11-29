import { Module } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { VerifyController } from './verify.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Investment,
  InvestmentSchema,
} from '../../../schemas/investments.schema';
import { Site, SiteSchema } from '../../../schemas/sites.schema';
import {
  BankAccount,
  BankAccountSchema,
} from '../../../schemas/bank_account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Investment.name, schema: InvestmentSchema },
      { name: Site.name, schema: SiteSchema },
      { name: BankAccount.name, schema: BankAccountSchema },
    ]),
  ],
  controllers: [VerifyController],
  providers: [VerifyService],
})
export class VerifyModule {}
