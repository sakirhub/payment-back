import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMethodDto } from './dto/create-method.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentMethod } from '../../../schemas/payment_methods.schema';
import { Model } from 'mongoose';
import { Site } from '../../../schemas/sites.schema';

@Injectable()
export class MethodService {
  constructor(
    @InjectModel(PaymentMethod.name) private paymentModel: Model<PaymentMethod>,
    @InjectModel(Site.name) private siteModel: Model<Site>,
  ) {}
  async create(createMethodDto: CreateMethodDto) {
    const site = await this.siteModel.findOne({
      access_token: createMethodDto['access_token'],
    });
    if (!site) {
      throw new BadRequestException('Site token not found');
    } else {
      return this.paymentModel.find({
        status: 1,
      });
    }
  }
}
