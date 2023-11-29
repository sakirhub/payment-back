import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBankAccountDto } from './dto/create-bank_account.dto';
import { UpdateBankAccountDto } from './dto/update-bank_account.dto';
import { Site } from '../schemas/sites.schema';
import { Model, Types } from 'mongoose';
import { BankAccount } from '../schemas/bank_account.schema';
import { Investment } from '../schemas/investments.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectModel(Site.name) private siteModel: Model<Site>,
    @InjectModel(BankAccount.name) private bankAccountModel: Model<BankAccount>,
    @InjectModel('Team') private teamModel: Model<any>,
    @InjectModel('PaymentMethod')
    private paymentMethodModel: Model<any>,
    @InjectModel('Investment')
    private investmentModel: Model<Investment>,
    @InjectModel('Investor')
    private investorModel: Model<any>,
    private eventEmitter: EventEmitter2,
  ) {}
  async create(createBankAccountDto: CreateBankAccountDto) {
    try {
      const objectId = new Types.ObjectId(createBankAccountDto.site);
      const objectIdTeam = new Types.ObjectId(createBankAccountDto.team);
      const objectIdPaymentMethod = new Types.ObjectId(
        createBankAccountDto.paymentmethods,
      );
      const site = await this.siteModel.findOne({ _id: objectId });
      const team = await this.teamModel.findOne({ _id: objectIdTeam });
      const paymentmethods = await this.paymentMethodModel.findOne({
        _id: objectIdPaymentMethod,
      });
      if (!site) {
        throw new Error('Site not found');
      }
      const BankAccount = new this.bankAccountModel();
      BankAccount.site = site._id;
      BankAccount.team = team._id;
      BankAccount.paymentmethods = paymentmethods._id;
      BankAccount.name = createBankAccountDto.name;
      BankAccount.account_number = createBankAccountDto.account_number;
      BankAccount.daily_limit = createBankAccountDto.daily_limit;
      BankAccount.min_transfer_amount =
        createBankAccountDto.min_transfer_amount;
      BankAccount.max_transfer_amount =
        createBankAccountDto.max_transfer_amount;
      BankAccount.status = createBankAccountDto.status;
      BankAccount.tc = createBankAccountDto.tc;
      BankAccount.password = createBankAccountDto.password;
      BankAccount.logs.push({
        message: `Bank account created`,
        timestamp: new Date(),
      });
      BankAccount.created = new Date();

      return BankAccount.save();
    } catch (error) {
      console.error('Error while creating bank account:', error);
      throw new Error(error);
    }
  }

  async findAll() {
    try {
      return await this.bankAccountModel
        .find({ deleted: null })
        .populate('site')
        .populate({
          path: 'paymentmethods',
          model: 'PaymentMethod',
        })
        .populate({
          path: 'team',
          model: 'Team',
        })
        .exec();
    } catch (error) {
      console.error('Error while fetching bank accounts:', error);
      throw new Error(error);
    }
  }

  async findOne(id: string) {
    const bankAccount = await this.bankAccountModel
      .findOne({ _id: id, deleted: null })
      .populate('site')
      .populate('paymentmethods')
      .populate('team')
      .exec();
    if (!bankAccount) {
      throw new NotFoundException('Bank account not found.');
    }
    return bankAccount;
  }

  async update(id: string, updateBankAccountDto: UpdateBankAccountDto) {
    const objectId = new Types.ObjectId(id);
    const bankAccount = await this.bankAccountModel.findOne(objectId);
    await this.siteModel.findOne({ _id: objectId });
    await this.siteModel.findOne({ _id: objectId });
    await this.siteModel.findOne({ _id: objectId });
    if (!bankAccount || bankAccount.deleted) {
      throw new NotFoundException('Bank account not found.');
    }

    if (updateBankAccountDto.name) {
      bankAccount.name = updateBankAccountDto.name;
      bankAccount.site = updateBankAccountDto.site;
      bankAccount.team = updateBankAccountDto.team;
      bankAccount.paymentmethods = updateBankAccountDto.paymentmethods;
      bankAccount.name = updateBankAccountDto.name;
      bankAccount.account_number = updateBankAccountDto.account_number;
      bankAccount.daily_limit = updateBankAccountDto.daily_limit;
      bankAccount.min_transfer_amount =
        updateBankAccountDto.min_transfer_amount;
      bankAccount.max_transfer_amount =
        updateBankAccountDto.max_transfer_amount;
      bankAccount.status = updateBankAccountDto.status;
      bankAccount.updated = new Date();
      bankAccount.logs.push({
        message: `Bank account updated `,
        timestamp: new Date(),
      });
    }
    const updatedBankAccount = await bankAccount.save();

    return updatedBankAccount;
  }

  async remove(id: string) {
    const objectId = new Types.ObjectId(id);
    try {
      if (!this.bankAccountModel.findById(objectId)) {
        throw new NotFoundException('Bank account not found.');
      }

      await this.bankAccountModel
        .findByIdAndUpdate(objectId, {
          deleted: new Date(),
        })
        .exec();
    } catch (error) {
      console.error('Error while deleting bank account:', error);
      throw new Error(error);
    }
  }

  async updateStatus(id: string, status: string) {
    const objectId = new Types.ObjectId(id);
    const stat = Number(status);
    const bankAccount = await this.bankAccountModel.findOne(objectId);
    if (!bankAccount || bankAccount.deleted) {
      throw new NotFoundException('Bank account not found.');
    }
    bankAccount.status = stat;
    bankAccount.updated = new Date();
    bankAccount.logs.push({
      message: `Bank account status updated to ${status}`,
      timestamp: new Date(),
    });

    return await bankAccount.save();
  }

  async logout(id: string) {
    const objectId = new Types.ObjectId(id);
    const bankAccount = await this.bankAccountModel.findOne(objectId);
    const bankName = bankAccount.name;
    const paymentMethod = await this.paymentMethodModel.findOne({
      _id: bankAccount.paymentmethods,
    });
    const paymentMethodName = paymentMethod.name;
    if (!bankAccount || bankAccount.deleted) {
      throw new NotFoundException('Bank account not found.');
    }
    bankAccount.login = 0;
    bankAccount.login_user = null;
    bankAccount.login_username = null;
    bankAccount.resume = 0;
    bankAccount.updated = new Date();
    bankAccount.logs.push({
      message: `Bank account logout`,
      timestamp: new Date(),
    });

    async function sendTelegramMessage(telegramMessage) {
      try {
        const telegram_bot_token =
          '6636666444:AAHJmVsE4Ve4S5174rEzSxqFfUKGOm0VoFg';

        const apiUrl = `https://api.telegram.org/bot${telegram_bot_token}/sendMessage`;
        const data = {
          chat_id: '-4084316784',
          text: telegramMessage,
        };

        const response = await axios.post(apiUrl, data);

        return response.data;
      } catch (error) {
        console.error('Error sending Telegram message:', error);
        throw error;
      }
    }
    const telegramMessage = `Banka hesabınız düştü lütfen tekrar giriş yapın. Banka adı: ${bankName} - ${paymentMethodName}, time: ${new Date().toLocaleString(
      'en-US',
      {
        timeZone: 'Europe/Istanbul',
      },
    )} @ilyasbatumi @batumibehzat Canlı destek lütfen müdahale edin! @KARABATAKOFFICIAL @kubaisup @YasarBatumi `;
    sendTelegramMessage(telegramMessage);
    return await bankAccount.save();
  }

  async updateResume(id: string, status: string) {
    const objectId = new Types.ObjectId(id);
    const stat = Number(status);
    const bankAccount = await this.bankAccountModel.findOne(objectId);
    if (!bankAccount || bankAccount.deleted) {
      throw new NotFoundException('Bank account not found.');
    }
    bankAccount.resume = stat;
    bankAccount.updated = new Date();
    bankAccount.logs.push({
      message: `Bank account resume updated to ${status}`,
      timestamp: new Date(),
    });

    return await bankAccount.save();
  }

  async updateLogin(
    id: string,
    status: string,
    user: string,
    username: string,
  ) {
    const objectId = new Types.ObjectId(id);
    const stat = Number(status);
    const user_id = Number(user);
    const bankAccount = await this.bankAccountModel.findOne(objectId);
    if (!bankAccount || bankAccount.deleted) {
      throw new NotFoundException('Bank account not found.');
    }
    bankAccount.login = stat;
    bankAccount.login_user = user_id;
    bankAccount.login_username = username;
    bankAccount.updated = new Date();
    bankAccount.logs.push({
      message: `Bank account login updated to ${status}`,
      timestamp: new Date(),
    });

    return await bankAccount.save();
  }

  async getLoginnedAccount(user: string) {
    return await this.bankAccountModel
      .find({ login_user: Number(user), resume: 1 })
      .populate('site')
      .populate('paymentmethods')
      .exec();
  }

  async getDetails(id: string) {
    const objectId = new Types.ObjectId(id);
    const bankAccount = await this.bankAccountModel
      .findOne(objectId)
      .populate('site')
      .populate('paymentmethods')
      .exec();
    return bankAccount;
  }

  async updateDetails(id: string, update: any) {
    const replaceTurkishCharacters = (text) => {
      const characterMappings = {
        ç: 'c',
        ğ: 'g',
        ı: 'i',
        ö: 'o',
        ş: 's',
        ü: 'u',
        Ç: 'C',
        Ğ: 'G',
        İ: 'I',
        Ö: 'O',
        Ş: 'S',
        Ü: 'U',
      };
      return [...text]
        .map((char) => characterMappings[char] || char)
        .join('')
        .toLowerCase();
    };

    const objectId = new Types.ObjectId(id);
    const account = await this.bankAccountModel.findById(objectId); // Use findById for querying by id

    if (!account || account.deleted) {
      throw new NotFoundException('Bank account not found.');
    }

    const existingDetails = account.details;

    try {
      for (const item of update) {
        let isDuplicate = false;
        for (const detail of existingDetails) {
          if (
            detail.user_name === item.user_name &&
            detail.amount === item.amount &&
            detail.last_balance === item.last_balance &&
            detail.created_bank === item.created_bank
          ) {
            // Eğer mevcut detaylar ile güncelleme detayları eşleşiyorsa,
            // isDuplicate bayrağını true yap
            isDuplicate = true;
            break; // Eşleşme bulundu, döngüden çık
          }
        }

        if (!isDuplicate) {
          account.details.push(item);
          const user = replaceTurkishCharacters(item.user_name);
          const userNameKeywords = user.split(' ').join(' ');
          const regex = new RegExp(userNameKeywords, 'i');
          const investor = await this.investorModel.findOne({
            user_name: { $regex: regex },
          });

          if (investor) {
            const investment = await this.investmentModel
              .findOne({
                bank_account: new Types.ObjectId(item.bank_id),
                status: 0,
                user: investor._id,
                amount: item.amount,
              })
              .populate('user site team bank_account payment_method');

            if (investment) {
              investment.status = 1;
              await investment.save();

              if (investment.status === 1 || investment.status === 2) {
                const callbackUrl = (
                  await this.siteModel.findById(investment.site)
                ).callback_url;
                const postData = {
                  transaction_id: investment.transaction_id,
                  user_id: investor.user_id,
                  status: investment.status === 1 ? 'success' : 'rejected',
                  amount: investment.amount,
                };

                let callbackResponse = '';
                try {
                  const response = await axios.post(callbackUrl, postData);
                  callbackResponse = response.data;
                } catch (error) {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  callbackResponse = error.response
                    ? `HTTP Error: ${error.response.status} - ${error.response.statusText} - ${error.response.config.url} - Data that cannot be sent : ${error.response.config.data}`
                    : `An error occurred while making the request.`;
                }
              }
              await account.save();
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async pushBankDetails(id: string, item: any) {
    const objectId = new Types.ObjectId(id);
    const account = await this.bankAccountModel.findById(objectId);

    if (!account || account.deleted) {
      throw new NotFoundException('Bank account not found.');
    }

    const existingDetail = account.details.find(
      (detail) =>
        detail.user_name == item.user_name &&
        detail.amount == item.amount &&
        detail.last_balance == item.last_balance &&
        detail.created_bank == item.created_bank,
    );

    if (!existingDetail) {
      function turkceKarakterleriCevir(metin) {
        const turkceKarakterler = {
          ç: 'c',
          ğ: 'g',
          ı: 'i',
          ö: 'o',
          ş: 's',
          ü: 'u',
          Ç: 'C',
          Ğ: 'G',
          İ: 'I',
          Ö: 'O',
          Ş: 'S',
          Ü: 'U',
        };

        return metin
          .replace(/[çğıöşüÇĞİÖŞÜ]/g, (karakter) => turkceKarakterler[karakter])
          .toLowerCase();
      }
      function generateObjectId() {
        return crypto.randomBytes(12).toString('hex');
      }
      const itemDetails = {
        _id: generateObjectId() as any,
        user_name: item.user_name,
        normalize_user: turkceKarakterleriCevir(item.user_name),
        amount: item.amount,
        last_balance: item.last_balance,
        created_bank: item.created_bank,
        created: new Date(),
        investment_id: new Types.ObjectId('655929fe2f8f0a5f38d19fd6'),
      };
      account.details.push(itemDetails);
      await account.save();

      const pending_investments = await this.investmentModel
        .find({
          status: 0,
          bank_account: account._id,
          amount: itemDetails.amount,
        })
        .populate('user site team payment_method')
        .populate({
          path: 'bank_account',
          select: 'id, name',
        })
        .exec();

      for (const investment of pending_investments) {
        try {
          // @ts-ignore
          const regexPattern = investment.user.user_full_name
            ? // @ts-ignore
              turkceKarakterleriCevir(investment.user.user_full_name)
            : '';
          const pending_detail = await this.bankAccountModel.findOne({
            details: {
              $elemMatch: {
                amount: investment.amount,
                normalize_user: investment.user
                  ? // @ts-ignore
                    { $regex: new RegExp(regexPattern, 'i') }
                  : undefined,
                investment_id: new Types.ObjectId('655929fe2f8f0a5f38d19fd6'),
              },
            },
          });
          if (pending_detail) {
            console.log('amount:', investment.amount);
            investment.status = 1;
            await investment.save();
            pending_detail.details.forEach((detail) => {
              if (detail._id.toString() === itemDetails._id.toString()) {
                detail.investment_id = investment._id;
                console.log('detail:', detail.amount);
              }
            });
            await pending_detail.save();
            if (investment.status === 1 || investment.status === 2) {
              this.eventEmitter.emit('updateInvestment', {
                investment,
                type: 'success',
              });
              const callbackUrl = (
                await this.siteModel.findById(investment.site)
              ).callback_url;
              const postData = {
                transaction_id: investment.transaction_id,
                // @ts-ignore
                user_id: investment.user?.user_id,
                status: investment.status === 1 ? 'success' : 'rejected',
                amount: investment.amount,
              };

              let callbackResponse = '';
              try {
                const response = await axios.post(callbackUrl, postData);
                callbackResponse = response.data;
              } catch (error) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                callbackResponse = error.response
                  ? `HTTP Error: ${error.response.status} - ${error.response.statusText} - ${error.response.config.url} - Data that cannot be sent : ${error.response.config.data}`
                  : `An error occurred while making the request.`;
              }

              async function sendTelegramMessage(messageSuccess: string) {
                try {
                  const telegram_bot_token =
                    '6636666444:AAHJmVsE4Ve4S5174rEzSxqFfUKGOm0VoFg';

                  const apiUrl = `https://api.telegram.org/bot${telegram_bot_token}/sendMessage`;
                  const data = {
                    chat_id: '-4084316784',
                    text: messageSuccess,
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
              const bankName = await this.bankAccountModel
                .findById(bankId)
                .exec();
              const TeamName = await this.teamModel.findById(teamId).exec();
              const messageSuccess = `
                İsim Soyisim: ${user.user_full_name},
                ${investment.amount} TL yatırım talebi onaylandı. ✅
                İşlem ID: ${investment.transaction_id}
                Banka hesabı: ${bankName.name}
                Yatırımı onaylayan grup: ${TeamName.name}
              `;
              await sendTelegramMessage(messageSuccess);
              break;
            }
          } else {
            const not_detail = await this.bankAccountModel.findOne({
              details: {
                $elemMatch: {
                  _id: itemDetails._id,
                },
              },
            });
            not_detail.details.forEach((detail) => {
              if (detail._id.toString() === itemDetails._id.toString()) {
                detail.investment_id = null;
              }
            });
            await not_detail.save();
          }
        } catch (error) {
          console.error(error);
        }
      }
      return {
        message: 'Bank account details added',
        data: itemDetails,
      };
    } else {
      return {
        message: 'Bank account details already exists',
      };
    }
  }

  async authenticateBankAccount(
    id: string,
    loginStatus: number,
    user: string,
    username: string,
  ) {
    const objectId = new Types.ObjectId(id);
    const bankAccount = await this.bankAccountModel.findOne(objectId);
    if (!bankAccount || bankAccount.deleted) {
      throw new NotFoundException('Bank account not found.');
    }
    bankAccount.login = loginStatus;
    bankAccount.login_user = Number(user);
    bankAccount.login_username = username;
    bankAccount.updated = new Date();
    bankAccount.logs.push({
      message: `${
        user ? 'Bank account login, user:' + user : 'Bank account logout'
      }`,
      timestamp: new Date(),
    });

    return await bankAccount.save();
  }

  async getTelegramId(id: string) {
    const objectId = new Types.ObjectId(id);
    const bankAccount = await this.bankAccountModel.findOne(objectId);
    if (!bankAccount || bankAccount.deleted) {
      throw new NotFoundException('Bank account not found.');
    }
    const bankName = bankAccount.name;
    const chatId = bankAccount.chat_id;
    return { bankName, chatId };
  }
}
