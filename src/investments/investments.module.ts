import { Module } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { InvestmentsController } from './investments.controller';
import { Investment, InvestmentSchema } from '../schemas/investments.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { SecurityRole } from 'src/entities/roles.entity';
import { Site, SiteSchema } from 'src/schemas/sites.schema';
import { Investor, InvestorSchema } from 'src/schemas/investors.schema';
import { ScheduleModule } from '@nestjs/schedule';
import {
  BankAccount,
  BankAccountSchema,
} from 'src/schemas/bank_account.schema';
import { Team, TeamSchema } from 'src/schemas/teams.schema';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([User, SecurityRole]),
    MongooseModule.forFeature([
      { name: Investment.name, schema: InvestmentSchema },
      { name: Investor.name, schema: InvestorSchema },
      { name: Site.name, schema: SiteSchema },
      { name: BankAccount.name, schema: BankAccountSchema },
      { name: Team.name, schema: TeamSchema },
    ]),
  ],
  providers: [InvestmentsService, UsersService],
  controllers: [InvestmentsController],
})
export class InvestmentsModule {}
