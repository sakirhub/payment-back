import { Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Site } from '../schemas/sites.schema';

@Injectable()
export class SitesService {
  constructor(@InjectModel(Site.name) private siteModel: Model<Site>) {}
  create(createSiteDto: CreateSiteDto) {
    try {
      const site = new this.siteModel(createSiteDto);
      site.created = new Date();
      return site.save();
    } catch (error) {
      console.error('Error while saving site:', error);
      throw error;
    }
  }

  findAll() {
    return this.siteModel.find().exec();
  }

  async findOne(id: string) {
    const objectId = new Types.ObjectId(id);
    return await this.siteModel.findOne({ _id: objectId }).exec();
  }

  async update(id: string, updateSiteDto: UpdateSiteDto) {
    const objectId = new Types.ObjectId(id);
    try {
      const site = await this.siteModel.findOne({ _id: objectId }).exec();
      if (updateSiteDto.name) site.name = updateSiteDto.name;
      if (updateSiteDto.callback_url)
        site.callback_url = updateSiteDto.callback_url;
      if (updateSiteDto.telegram_bot_token)
        site.telegram_bot_token = updateSiteDto.telegram_bot_token;
      if (updateSiteDto.auto_bank_transfer_chat_id)
        site.auto_bank_transfer_chat_id =
          updateSiteDto.auto_bank_transfer_chat_id;
      if (updateSiteDto.manual_bank_transfer_chat_id)
        site.manual_bank_transfer_chat_id =
          updateSiteDto.manual_bank_transfer_chat_id;
      if (updateSiteDto.access_token)
        site.access_token = updateSiteDto.access_token;
      if (updateSiteDto.commission) site.commission = updateSiteDto.commission;
      site.updated = new Date();
      return await site.save();
    } catch (error) {
      console.error('Error while updating site:', error);
      throw error;
    }
  }

  async remove(id: string) {
    const objectId = new Types.ObjectId(id);
    try {
      return await this.siteModel.findByIdAndDelete(objectId).exec();
    } catch (error) {
      console.error('Error while deleting site:', error);
      throw error;
    }
  }
}
