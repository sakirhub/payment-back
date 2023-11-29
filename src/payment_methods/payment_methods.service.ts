import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment_method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment_method.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentMethod } from '../schemas/payment_methods.schema';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectModel(PaymentMethod.name) private paymentModel: Model<PaymentMethod>,
  ) {}
  create(createPaymentMethodDto: CreatePaymentMethodDto) {
    try {
      const payment = new this.paymentModel(createPaymentMethodDto);
      payment.logo = '';
      payment.created = new Date();
      return payment.save();
    } catch (e) {
      console.error('Error while creating payment method:', e);
      throw new InternalServerErrorException(e);
    }
  }

  findAll() {
    try {
      return this.paymentModel.find().exec();
    } catch (e) {
      console.error('Error while fetching payment methods:', e);
      throw new NotFoundException(e);
    }
  }

  async findOne(id: string) {
    try {
      const payment = await this.paymentModel.findById(id).exec();
      if (!payment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }
      return payment;
    } catch (e) {
      console.error('Error while fetching payment method:', e);
      throw new NotFoundException(e);
    }
  }

  async update(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    try {
      const payment = await this.paymentModel.findById(id).exec();

      if (!payment) {
        throw new NotFoundException(`Investment with ID ${id} not found`);
      }

      if (payment.status !== updatePaymentMethodDto.status) {
        payment.name = updatePaymentMethodDto.name;
        payment.status = updatePaymentMethodDto.status;
        payment.logo = updatePaymentMethodDto.logo;
        payment.updated = new Date();
        await payment.save();
      } else {
        throw new BadRequestException('Status is the same');
      }

      await payment.save();

      return payment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const payment = await this.paymentModel.findByIdAndRemove(id).exec();

      if (!payment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }

      return 'Payment method deleted successfully' + payment;
    } catch (e) {
      console.error('Error while deleting payment method:', e);
      throw new NotFoundException(e);
    }
  }
}
