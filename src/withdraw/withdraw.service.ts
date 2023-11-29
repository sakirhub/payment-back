import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { Withdraw } from '../schemas/withdraw.schema';
import { Team } from '../schemas/teams.schema';
import { Site } from '../schemas/sites.schema';
import { Investor } from '../schemas/investors.schema';

@Injectable()
export class WithdrawService {
  constructor(
    @InjectModel(Investor.name) private readonly investorModel: Model<Investor>,
    @InjectModel(Site.name) private readonly siteModel: Model<Site>,
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
    @InjectModel(Withdraw.name) private readonly withdrawModel: Model<Withdraw>,
  ) {}

  async create(createWithdrawDto: CreateWithdrawDto) {
    try {
      const site = await this.siteModel.findOne({
        _id: createWithdrawDto.site,
      });
      if (!site) {
        throw new NotFoundException('Site not found');
      }
      const user = await this.investorModel.findOne({
        _id: createWithdrawDto.user,
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const team = await this.teamModel.findOne({
        _id: createWithdrawDto.team,
      });
      if (!team) {
        throw new NotFoundException('Team not found');
      }

      const withDraw = new this.withdrawModel(createWithdrawDto);
      withDraw.status = createWithdrawDto.status;
      withDraw.site = site._id;
      withDraw.user = user._id;
      withDraw.team = team._id;
      withDraw.amount = createWithdrawDto.amount;
      withDraw.bank_account_name = createWithdrawDto.bank_account_name;
      withDraw.bank_account_number = createWithdrawDto.bank_account_number;
      withDraw.created = new Date();

      return await withDraw.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.withdrawModel.find();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.withdrawModel.findOne({ _id: id });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(id: string, updateWithdrawDto: UpdateWithdrawDto) {
    try {
      const withdraw = await this.withdrawModel.findOne({ _id: id });
      if (!withdraw) {
        throw new NotFoundException('Withdraw not found');
      }

      const site = await this.siteModel.findOne({
        _id: updateWithdrawDto.site,
      });
      if (!site) {
        throw new NotFoundException('Site not found');
      }
      const user = await this.investorModel.findOne({
        _id: updateWithdrawDto.user,
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const team = await this.teamModel.findOne({
        _id: updateWithdrawDto.team,
      });
      if (!team) {
        throw new NotFoundException('Team not found');
      }

      withdraw.status = updateWithdrawDto.status;
      withdraw.site = site._id;
      withdraw.user = user._id;
      withdraw.team = team._id;
      withdraw.amount = updateWithdrawDto.amount;
      withdraw.bank_account_name = updateWithdrawDto.bank_account_name;
      withdraw.bank_account_number = updateWithdrawDto.bank_account_number;
      withdraw.updated = new Date();

      return await withdraw.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
