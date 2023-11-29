import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { InvestmentsModule } from './investments/investments.module';
import { SitesModule } from './sites/sites.module';
import { DepositModule } from './api/deposit/deposit.module';
import { TeamsModule } from './teams/teams.module';
import { PaymentMethodsModule } from './payment_methods/payment_methods.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PermisionsModule } from './permisions/permisions.module';
import { Permision } from './permisions/entities/permision.entity';
import { SecurityRole } from './entities/roles.entity';
import { SecurityRolePermisions } from './entities/roles.permisions.entity';
import { WithdrawModule } from './withdraw/withdraw.module';
import { LogsModule } from './logs/logs.module';
import { Logs } from './entities/logs.entity';
import { BankAccountsModule } from './bank_accounts/bank_accounts.module';
import { MethodModule } from './api/bank-trasfer/method/method.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      // socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
      entities: [User, Permision, SecurityRole, SecurityRolePermisions, Logs],
      synchronize: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
    }),
    EventEmitterModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10h' },
    }),
    UsersModule,
    InvestmentsModule,
    SitesModule,
    DepositModule,
    TeamsModule,
    PaymentMethodsModule,
    AuthModule,
    PermisionsModule,
    WithdrawModule,
    LogsModule,
    BankAccountsModule,
    MethodModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
