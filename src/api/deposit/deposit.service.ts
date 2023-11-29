import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Investment } from '../../schemas/investments.schema';
import { Model, Types } from 'mongoose';
import { Site } from '../../schemas/sites.schema';
import { Investor } from '../../schemas/investors.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentMethod } from '../../schemas/payment_methods.schema';
import { BankAccount } from '../../schemas/bank_account.schema';
import { Team } from '../../schemas/teams.schema';
@Injectable()
export class DepositService {
  constructor(
    @InjectModel(Investment.name) private investmentModel: Model<Investment>,
    @InjectModel(Site.name) private siteModel: Model<Site>,
    @InjectModel(Investor.name) private investorModel: Model<Investor>,
    @InjectModel(PaymentMethod.name)
    private paymentMethodModel: Model<PaymentMethod>,
    @InjectModel(BankAccount.name) private bankAccountModel: Model<BankAccount>,
    @InjectModel(Team.name) private teamModel: Model<Team>,
    private eventEmitter: EventEmitter2,
  ) {}
  async create(createDepositDto: CreateDepositDto) {
    try {
      const token = createDepositDto.access_token;
      const site = await this.siteModel.findOne({ access_token: token });
      if (!site) {
        throw new UnauthorizedException('Access token is invalid.');
      }
      const investment = new this.investmentModel();

      const investor = createDepositDto.user;
      if (await this.investorModel.findOne({ user_id: investor.user_id })) {
        investment.user = await this.investorModel.findOne({
          user_id: investor.user_id,
        });
        const oldInvestment = await this.investmentModel.findOne({
          user: investment.user._id,
          site: site._id,
          status: 0,
          amount: createDepositDto.amount,
        });
        if (oldInvestment) {
          throw new BadRequestException(
            'Investment already exists or old investment is not completed.',
          );
        }
      } else {
        await this.investorModel.create({
          user_id: investor.user_id,
          user_name: investor.user_name,
          user_full_name: investor.user_full_name,
          site: site._id,
        });
        investment.user = await this.investorModel.findOne({
          user_id: investor.user_id,
        });
      }
      investment.status = 0;
      investment.site = site._id;
      investment.amount = createDepositDto.amount;
      investment.payment_method = new Types.ObjectId(
        createDepositDto.payment_method,
      )
        ? new Types.ObjectId(createDepositDto.payment_method)
        : null;
      investment.transaction_id = createDepositDto.transaction_id;

      const bankAccounts = await this.bankAccountModel.find({
        paymentmethods: investment.payment_method,
        status: 1,
      });
      if (bankAccounts.length > 0) {
        const randomIndex = Math.floor(Math.random() * bankAccounts.length);
        const randomBankAccount = bankAccounts[randomIndex];
        investment.team = randomBankAccount.team;
      }
      investment.bank_account = null;
      investment.logs = [
        {
          timestamp: new Date(),
          message: 'Investment created.',
        },
      ];
      await investment.save();
      const method = await this.paymentMethodModel.findById(
        investment.payment_method,
      );
      if (method) {
        const sendInvestment: any = await this.investmentModel
          .find(investment._id)
          .populate('site')
          .populate('user')
          .populate('team')
          .populate('bank_account')
          .populate('payment_method')
          .exec();
        this.eventEmitter.emit('newInvestment', sendInvestment);
        const bankAccounts = await this.bankAccountModel
          .find({ paymentmethods: method._id, status: 1 })
          .populate('paymentmethods')
          .exec();
        const bankAccountsArray = [];
        for (const bankAccount of bankAccounts) {
          bankAccountsArray.push({
            id: bankAccount._id,
            // @ts-ignore
            bank_name: bankAccount.paymentmethods?.name,
            name: bankAccount.name,
            account_number: bankAccount.account_number,
            min_transfer_amount: bankAccount.min_transfer_amount,
            max_transfer_amount: bankAccount.max_transfer_amount,
            status: bankAccount.status,
          });
        }
        if (bankAccounts.length > 0) {
          return {
            investment: {
              transaction_id: sendInvestment[0].transaction_id,
              amount: sendInvestment[0].amount,
              status: sendInvestment[0].status,
              created: sendInvestment[0].created,
              user: sendInvestment[0].user,
            },
            bank_accounts: bankAccountsArray,
          };
        } else {
          return {
            investment: {
              transaction_id: sendInvestment[0].transaction_id,
              amount: sendInvestment[0].amount,
              status: sendInvestment[0].status,
              created: sendInvestment[0].created,
              user: sendInvestment[0].user,
            },
            bank_accounts: [],
          };
        }
      } else {
        throw new UnauthorizedException('Payment method not found.');
      }
    } catch (error) {
      console.error('Error while saving investment:', error);
      throw new UnauthorizedException(error.message);
    }
  }

  async findAll() {
    try {
      return await this.investmentModel
        .find()
        .populate('user')
        .populate('site')
        .populate({
          path: 'payment_method',
          populate: {
            path: 'site',
            model: 'Site',
          },
        })
        .exec();
    } catch (error) {
      throw new UnauthorizedException('No investments found.');
    }
  }

  async findBankAccountsByPaymentMethod(paymentMethodId: string) {
    try {
      // İlgili ödeme yöntemini (payment_method) buluyorum
      const selectedPaymentMethod =
        await this.paymentMethodModel.findById(paymentMethodId);

      if (!selectedPaymentMethod) {
        throw new UnauthorizedException('Payment method not found.');
      }

      //ilgili yatırımı buluyorum payment methoda göre
      const investment = await this.investmentModel.findOne({
        payment_method: selectedPaymentMethod._id,
      });

      if (!investment) {
        throw new UnauthorizedException(
          'No investments found for the specified payment method.',
        );
      }

      // İlgili ödeme yöntemine ait tüm banka hesaplarını alıyorum ve döndürüyorum
      const bankAccounts = await this.bankAccountModel
        .where({
          paymentmethods: selectedPaymentMethod._id,
          status: 1,
        })
        .populate('paymentmethods')
        .exec();

      const bankAccountsList = bankAccounts.map((bankAccount) => ({
        id: bankAccount._id,
        bank_name: selectedPaymentMethod.name,
        name: bankAccount.name,
        account_number: bankAccount.account_number,
        status: bankAccount.status,
      }));

      return {
        investment: {
          transaction_id: investment.transaction_id,
          amount: investment.amount,
          status: investment.status,
          created: investment.created,
          user: investment.user,
        },
        bank_accounts: bankAccountsList,
      };
    } catch (error) {
      throw new UnauthorizedException(
        'No bank accounts found for the specified payment method.',
      );
    }
  }
}
