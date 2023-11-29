import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Investment } from '../schemas/investments.schema';
import { updateInvestmentDto } from './dto/update-investment.dto';
import { updateBankInvestmentDto } from './dto/update-bank-investment.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Site } from 'src/schemas/sites.schema';
import { Investor } from 'src/schemas/investors.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BankAccount } from 'src/schemas/bank_account.schema';
import { Team } from 'src/schemas/teams.schema';
@Injectable()
export class InvestmentsService {
  private readonly logger = new Logger(InvestmentsService.name);
  constructor(
    @InjectModel(Investment.name) private investmentModel: Model<Investment>,
    @InjectModel(Investor.name) private investorModel: Model<Investor>,
    private eventEmitter: EventEmitter2,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectModel('Site') private readonly siteModel: Model<Site>,
    @InjectModel(BankAccount.name)
    private readonly bankAccountModel: Model<BankAccount>,
    @InjectModel('Team') private readonly TeamModel: Model<Team>,
  ) {}
  async findAll(
    page: number = 1,
    itemsPerPage: number = 10,
    group_id: number,
    site_id: number,
    user: any,
  ): Promise<{ data: Investment[]; totalPages: number; currentPage: any }> {
    page = parseInt(page as any);
    itemsPerPage = parseInt(itemsPerPage as any);
    if (isNaN(page) || isNaN(itemsPerPage)) {
      throw new BadRequestException('Invalid query params');
    }
    const skipAmount = (page - 1) * itemsPerPage;
    let theConditions = {};
    if (group_id !== 0) {
      theConditions = { team: group_id };
    } else if (site_id !== 0) {
      theConditions = { site: site_id };
    }
    let theUser = {};
    if (user.site) {
      const site = new Types.ObjectId(user.site);
      theUser = { site: site };
    }
    if (user.group) {
      const group = new Types.ObjectId(user.group);
      theUser = { team: group };
    }
    try {
      const [data, totalCount] = await Promise.all([
        this.investmentModel
          .find(theUser)
          .skip(skipAmount)
          .limit(itemsPerPage)
          .populate('site')
          .populate('user')
          .populate('team')
          .populate({
            path: 'bank_account',
            select: 'name',
          })
          .populate('payment_method')
          .sort({ created: -1 })
          .exec(),
        this.investmentModel.countDocuments(),
      ]);

      const totalPages = Math.ceil(totalCount / itemsPerPage);

      return {
        data,
        totalPages,
        currentPage: theUser,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  async findAllPending(
    page: number = 1,
    itemsPerPage: number = 10,
    group_id: number,
    site_id: number,
    user: any,
  ): Promise<{ data: Investment[]; totalPages: number; currentPage: any }> {
    page = parseInt(page as any);
    itemsPerPage = parseInt(itemsPerPage as any);
    if (isNaN(page) || isNaN(itemsPerPage)) {
      throw new BadRequestException('Invalid query params');
    }
    const skipAmount = (page - 1) * itemsPerPage;
    let theConditions = {};
    if (group_id !== 0) {
      theConditions = { team: group_id };
    } else if (site_id !== 0) {
      theConditions = { site: site_id };
    }
    let theUser = {};
    if (user.site) {
      const site = new Types.ObjectId(user.site);
      theUser = { site: site };
    }
    if (user.group) {
      const group = new Types.ObjectId(user.group);
      theUser = { team: group };
    }
    try {
      const [data, totalCount] = await Promise.all([
        this.investmentModel
          .find(theUser)
          .where({ status: 0 })
          .skip(skipAmount)
          .limit(itemsPerPage)
          .populate('site')
          .populate('user')
          .populate('team')
          .populate({
            path: 'bank_account',
            select: 'name',
          })
          .populate('payment_method')
          .sort({ created: -1 })
          .exec(),
        this.investmentModel.countDocuments(),
      ]);

      const totalPages = Math.ceil(totalCount / itemsPerPage);

      return {
        data,
        totalPages,
        currentPage: theUser,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  async findAllPaid(
    page: number = 1,
    itemsPerPage: number = 10,
    group_id: number,
    site_id: number,
    user: any,
  ): Promise<{ data: Investment[]; totalPages: number; currentPage: any }> {
    page = parseInt(page as any);
    itemsPerPage = parseInt(itemsPerPage as any);
    if (isNaN(page) || isNaN(itemsPerPage)) {
      throw new BadRequestException('Invalid query params');
    }
    const skipAmount = (page - 1) * itemsPerPage;
    let theConditions = {};
    if (group_id !== 0) {
      theConditions = { team: group_id };
    } else if (site_id !== 0) {
      theConditions = { site: site_id };
    }
    let theUser = {};
    if (user.site) {
      const site = new Types.ObjectId(user.site);
      theUser = { site: site };
    }
    if (user.group) {
      const group = new Types.ObjectId(user.group);
      theUser = { team: group };
    }
    try {
      const [data, totalCount] = await Promise.all([
        this.investmentModel
          .find(theUser)
          .where({ status: 1 })
          .skip(skipAmount)
          .limit(itemsPerPage)
          .populate('site')
          .populate('user')
          .populate('team')
          .populate({
            path: 'bank_account',
            select: 'name',
          })
          .populate('payment_method')
          .sort({ created: -1 })
          .exec(),
        this.investmentModel.countDocuments(),
      ]);

      const totalPages = Math.ceil(totalCount / itemsPerPage);

      return {
        data,
        totalPages,
        currentPage: theUser,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  async findAllUnPaid(
    page: number = 1,
    itemsPerPage: number = 10,
    group_id: number,
    site_id: number,
    user: any,
  ): Promise<{ data: Investment[]; totalPages: number; currentPage: any }> {
    page = parseInt(page as any);
    itemsPerPage = parseInt(itemsPerPage as any);
    if (isNaN(page) || isNaN(itemsPerPage)) {
      throw new BadRequestException('Invalid query params');
    }
    const skipAmount = (page - 1) * itemsPerPage;
    let theConditions = {};
    if (group_id !== 0) {
      theConditions = { team: group_id };
    } else if (site_id !== 0) {
      theConditions = { site: site_id };
    }
    let theUser = {};
    if (user.site) {
      const site = new Types.ObjectId(user.site);
      theUser = { site: site };
    }
    if (user.group) {
      const group = new Types.ObjectId(user.group);
      theUser = { team: group };
    }
    try {
      const [data, totalCount] = await Promise.all([
        this.investmentModel
          .find(theUser)
          .where({ status: 2 })
          .skip(skipAmount)
          .limit(itemsPerPage)
          .populate('site')
          .populate('user')
          .populate('team')
          .populate({
            path: 'bank_account',
            select: 'name',
          })
          .populate('payment_method')
          .sort({ created: -1 })
          .exec(),
        this.investmentModel.countDocuments(),
      ]);

      const totalPages = Math.ceil(totalCount / itemsPerPage);

      return {
        data,
        totalPages,
        currentPage: theUser,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  async getBankAccountDailyInvestmentTotal(
    bank_account_id: string,
  ): Promise<any> {
    try {
      const bank_account = new Types.ObjectId(bank_account_id);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const start = new Date(currentDate);
      currentDate.setHours(23, 59, 59, 999);
      const end = new Date(currentDate);
      const data = await this.investmentModel
        .aggregate([
          {
            $match: {
              bank_account: bank_account,
              created: {
                $gte: start,
                $lte: end,
              },
              status: 1,
            },
          },
          {
            $group: {
              _id: {
                bank_account: '$bank_account',
              },
              total: {
                $sum: '$amount',
              },
            },
          },
        ])
        .exec();

      return data;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findPartialReport(
    group_id: number,
    site_id: number,
    RType: string,
    customDate: string,
  ) {
    let start: Date;
    let end: Date;
    if (RType === 'daily') {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      start = new Date(currentDate);
      currentDate.setHours(23, 59, 59, 999);
      end = new Date(currentDate);
    } else if (RType === 'weekly') {
      const suAnkiTarih = new Date();
      const gun = suAnkiTarih.getDay();
      start = new Date(suAnkiTarih);
      start.setDate(suAnkiTarih.getDate() - gun + (gun === 0 ? -6 : 1));
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else if (RType === 'monthly') {
      const currentDate = new Date();
      start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      start.setHours(0, 0, 0, 0);
      end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
    } else if (RType === 'custom') {
      const theDates = customDate.split('SEPE');
      start = new Date(theDates[0]);
      end = new Date(theDates[1]);
    }
    let theConditions = {};
    if (group_id !== 0) {
      theConditions = { team: group_id };
    } else if (site_id !== 0) {
      theConditions = { site: site_id };
    }
    try {
      const data = await this.investmentModel
        .aggregate([
          {
            $match: {
              created: {
                $gte: start,
                $lte: end,
              },
              status: 1,
            },
          },
          {
            $lookup: {
              from: 'sites',
              localField: 'site',
              foreignField: '_id',
              as: 'st',
            },
          },
          {
            $lookup: {
              from: 'teams',
              localField: 'team',
              foreignField: '_id',
              as: 'tm',
            },
          },

          {
            $group: {
              _id: {
                site: '$st',
                team: '$tm',
              },
              total: {
                $sum: '$amount',
              },
            },
          },
        ])
        .exec();

      return {
        data,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(
    id: string,
    updateInvestmentDto: updateInvestmentDto,
  ): Promise<Investment> {
    try {
      const investment = await this.investmentModel.findById(id).exec();

      if (!investment) {
        throw new NotFoundException(`Investment with ID ${id} not found`);
      }

      if (investment.status !== updateInvestmentDto.status) {
        investment.status = updateInvestmentDto.status;
        if (updateInvestmentDto.amount) {
          investment.amount = updateInvestmentDto.amount;
        }
        await investment.save();
      } else {
        throw new BadRequestException('Status is the same');
      }

      investment.logs.push({
        message: `Investment status changed to ${updateInvestmentDto.status}`,
        timestamp: new Date(),
      });

      const sendInvestment = await this.investmentModel
        .findById(investment._id)
        .populate('site')
        .populate('user')
        .populate('team')
        .populate('bank_account')
        .populate('payment_method')
        .exec();
      this.eventEmitter.emit('updateInvestment', {
        investment: sendInvestment,
        type:
          investment.status === 1
            ? 'success'
            : investment.status === 2
            ? 'failed'
            : 'pending',
      });

      if (investment.status === 1 || investment.status === 2) {
        const callbackUrl = (await this.siteModel.findById(investment.site))
          .callback_url;
        const investor = await this.investorModel.findById(investment.user);
        const statusDescription =
          investment.status === 1 ? 'success' : 'rejected';
        const postData = {
          transaction_id: investment.transaction_id,
          user_id: investor.user_id,
          status: statusDescription,
          amount: updateInvestmentDto.amount || investment.amount,
        };

        let response = null;
        let errResponse = '';
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          response = await axios.post(callbackUrl, postData);
        } catch (error) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          errResponse = error.message;
        }

        async function sendTelegramMessage(message) {
          try {
            const telegram_bot_token =
              '6636666444:AAHJmVsE4Ve4S5174rEzSxqFfUKGOm0VoFg';

            const apiUrl = `https://api.telegram.org/bot${telegram_bot_token}/sendMessage`;
            const data = {
              chat_id: '-4084316784',
              text: message,
            };

            const response = await axios.post(apiUrl, data);
            console.log('Telegram message sent:', response.data);

            return response.data;
          } catch (error) {
            console.error('Error sending Telegram message:', error);
            throw error;
          }
        }

        const investmentUserId = investment.user as any;
        const bankId = investment.bank_account as any;
        const teamId = investment.team;
        const user = await this.investorModel.findById(investmentUserId).exec();
        const bankName = await this.bankAccountModel.findById(bankId).exec();
        const TeamName = await this.TeamModel.findById(teamId).exec();

        if (investment.status == 1) {
          const message = `
          İsim Soyisim: ${user.user_full_name},
          ${investment.amount} TL yatırım talebi onaylandı.
          İşlem ID: ${investment.transaction_id}
          Banka hesabı: ${bankName.name}
          Yatırımı onaylayan grup: ${TeamName.name}
          `;
          sendTelegramMessage(message);
        } else {
          const message = `
        İsim Soyisim: ${user.user_full_name},
        ${investment.amount} TL yatırım talebi reddedildi. ❌
        İşlem ID: ${investment.transaction_id}
        Banka hesabı: ${bankName.name}
        Yatırımı reddeden grup: ${TeamName.name}
        `;
          sendTelegramMessage(message);
        }
      }

      return investment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateBank(
    id: string,
    updateInvestmentDto: updateBankInvestmentDto,
  ): Promise<Investment> {
    try {
      const investment = await this.investmentModel.findById(id).exec();

      if (!investment) {
        throw new NotFoundException(`Investment with ID ${id} not found`);
      }

      if (!investment.bank_account && updateInvestmentDto.bank_account) {
        investment.bank_account = new Types.ObjectId(
          updateInvestmentDto.bank_account,
        );
        await investment.save();
      }

      investment.logs.push({
        message: `Investment bank account changed to ${updateInvestmentDto.bank_account}`,
        timestamp: new Date(),
      });

      await investment.save();
      const sendInvestment = await this.investmentModel
        .find(investment._id)
        .populate('site')
        .populate('user')
        .populate('team')
        .populate('bank_account')
        .populate('payment_method')
        .exec();
      this.eventEmitter.emit('updateInvestment', {
        investment: sendInvestment,
        type: 'bank',
      });

      return investment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async dailyTotalAmount(): Promise<any> {
    try {
      const data = await this.investmentModel
        .aggregate([
          {
            $match: {
              status: 1,
            },
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$created',
                  timezone: 'Europe/Istanbul',
                },
              },
              totalAmount: {
                $sum: '$amount',
              },
              lastCreated: {
                $last: '$created',
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: '$_id',
              totalAmount: 1,
              lastCreated: 1,
            },
          },
          {
            $sort: {
              lastCreated: -1,
            },
          },
        ])
        .exec();
      return data;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async monthlyTotalAmount(): Promise<any> {
    try {
      const data = await this.investmentModel
        .aggregate([
          {
            $match: {
              status: 1,
            },
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m',
                  date: '$created',
                  timezone: 'Europe/Istanbul',
                },
              },
              totalAmount: {
                $sum: '$amount',
              },
              lastCreated: {
                $last: '$created',
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: '$_id',
              totalAmount: 1,
              lastCreated: 1,
            },
          },
          {
            $sort: {
              lastCreated: -1,
            },
          },
        ])
        .exec();
      return data;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async yearlyTotalAmount(): Promise<any> {
    try {
      const data = await this.investmentModel
        .aggregate([
          {
            $match: {
              status: 1,
            },
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y',
                  date: '$created',
                  timezone: 'Europe/Istanbul',
                },
              },
              totalAmount: {
                $sum: '$amount',
              },
              lastCreated: {
                $last: '$created',
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: '$_id',
              totalAmount: 1,
              lastCreated: 1,
            },
          },
          {
            $sort: {
              lastCreated: -1,
            },
          },
        ])
        .exec();
      return data;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getDailyInvestmentData(date: string): Promise<any> {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const data = await this.investmentModel
        .aggregate([
          {
            $match: {
              status: 1,
              created: {
                $gte: startDate,
                $lt: endDate,
              },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$created',
                  timezone: 'Europe/Istanbul',
                },
              },
              totalAmount: {
                $sum: '$amount',
              },
              lastCreated: {
                $last: '$created',
              },
              transactions: {
                $push: '$$ROOT',
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: '$_id',
              totalAmount: 1,
              transactions: 1,
            },
          },
          {
            $sort: {
              lastCreated: -1,
            },
          },
        ])
        .exec();

      return data;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getInvestmentDetails(id: string): Promise<any> {
    try {
      const investment = await this.investmentModel
        .find({ _id: id })
        .populate('user')
        .populate('team', 'name')
        .populate('payment_method', 'name')
        .populate('bank_account', 'name')
        .exec();

      if (!investment) {
        throw new NotFoundException(`Investment with ID ${id} not found`);
      }

      return investment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const currentTime = new Date();
    const investments = await this.investmentModel.find({ status: 0 }).exec();
    for (const investment of investments) {
      const createdTime: Date = investment.created;
      const diffInMilliseconds = currentTime.getTime() - createdTime.getTime();

      // 1 dakika (60 saniye)
      if (diffInMilliseconds >= 600000) {
        // Update investment status
        investment.status = 2;
        await investment.save();
        this.logger.warn(`Yatırım reddedildi - ID: ${investment._id}`);

        // Retrieve the callback URL
        const site = await this.siteModel.findById(investment.site).exec();
        const callbackUrl = site.callback_url;

        // Prepare callback data
        const investor = await this.investorModel
          .findById(investment.user)
          .exec();
        const postData = {
          transaction_id: investment.transaction_id,
          user_id: investor.user_id,
          status: 'rejected', // Or the appropriate status
          amount: investment.amount,
        };

        // Send the callback request
        try {
          await axios.post(callbackUrl, postData);
          async function sendTelegramMessage(messageAutoReject: string) {
            try {
              const telegram_bot_token =
                '6636666444:AAHJmVsE4Ve4S5174rEzSxqFfUKGOm0VoFg';

              const apiUrl = `https://api.telegram.org/bot${telegram_bot_token}/sendMessage`;
              const data = {
                chat_id: '-4084316784',
                text: messageAutoReject,
              };

              const response = await axios.post(apiUrl, data);
              console.log('Telegram message sent:', response.data);

              return response.data;
            } catch (error) {
              console.error('Error sending Telegram message:', error);
              throw error;
            }
          }
          const investmentUserId = investment.user as any;
          const bankId = investment.bank_account as any;
          const teamId = investment.team;
          const user = await this.investorModel
            .findById(investmentUserId)
            .exec();
          const bankName = await this.bankAccountModel.findById(bankId).exec();
          const TeamName = await this.TeamModel.findById(teamId).exec();
          const messageAutoReject = `
        İsim Soyisim: ${user.user_full_name},
        ${investment.amount} TL yatırım talebi reddedildi. ❌
        İşlem ID: ${investment.transaction_id}
        Banka hesabı: ${bankName.name}
        Yatırımı reddeden grup: ${TeamName.name}
        `;
          await sendTelegramMessage(messageAutoReject);
        } catch (error) {
          this.logger.error(
            `Callback request failed for investment ID ${investment._id}`,
          );
        }
      }
    }
  }
}