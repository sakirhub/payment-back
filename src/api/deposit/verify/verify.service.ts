import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateVerifyDto } from './dto/create-verify.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Investment } from '../../../schemas/investments.schema';
import { Model, Types } from 'mongoose';
import { Site } from '../../../schemas/sites.schema';
import { BankAccount } from '../../../schemas/bank_account.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class VerifyService {
  constructor(
    @InjectModel(Investment.name) private investmentModel: Model<Investment>,
    @InjectModel(Site.name) private siteModel: Model<Site>,
    @InjectModel(BankAccount.name) private bankAccountModel: Model<BankAccount>,
    private eventEmitter: EventEmitter2,
  ) {}
  async create(createVerifyDto: CreateVerifyDto) {
    try {
      const token = createVerifyDto.access_token;
      const bank_account_id = createVerifyDto.bank_account_id;
      const site = await this.siteModel.findOne({ access_token: token });
      if (!site) {
        throw new UnauthorizedException('Access token is invalid.');
      }
      const transaction_id = createVerifyDto.transaction_id;
      const investment = await this.investmentModel.findOne({
        transaction_id: transaction_id,
      });
      if (!investment) {
        throw new UnauthorizedException('Transaction id is invalid.');
      }
      const bank_account = await this.bankAccountModel.findOne({
        _id: bank_account_id,
      });
      if (!bank_account) {
        throw new UnauthorizedException('Bank account is invalid.');
      }
      investment.bank_account = await bank_account._id;
      investment.payment_method = new Types.ObjectId(
        bank_account.paymentmethods,
      );
      await investment.save();
      const sendInvestment = await this.investmentModel
        .findOne(investment._id)
        .populate('site')
        .populate('user')
        .populate('team')
        .populate('bank_account')
        .populate('payment_method')
        .exec();
      this.eventEmitter.emit('updateInvestment', {
        investment: sendInvestment,
        type: 'verify',
      });
      return {
        status: 'success',
        transaction_id: sendInvestment.transaction_id,
      };
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
