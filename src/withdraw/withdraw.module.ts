import { Module } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { WithdrawController } from './withdraw.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from '../schemas/sites.schema';
import { Team, TeamSchema } from '../schemas/teams.schema';
import { Investor, InvestorSchema } from '../schemas/investors.schema';
import { Withdraw, WithdrawSchema } from '../schemas/withdraw.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Investor.name, schema: InvestorSchema },
      { name: Site.name, schema: SiteSchema },
      { name: Team.name, schema: TeamSchema },
      { name: Withdraw.name, schema: WithdrawSchema },
    ]),
  ],
  controllers: [WithdrawController],
  providers: [WithdrawService],
})
export class WithdrawModule {}
