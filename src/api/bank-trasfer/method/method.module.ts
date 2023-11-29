import { Module } from '@nestjs/common';
import { MethodService } from './method.service';
import { MethodController } from './method.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentMethod,
  PaymentMethodSchema,
} from '../../../schemas/payment_methods.schema';
import { Site, SiteSchema } from '../../../schemas/sites.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentMethod.name, schema: PaymentMethodSchema },
      { name: Site.name, schema: SiteSchema },
    ]),
  ],
  controllers: [MethodController],
  providers: [MethodService],
})
export class MethodModule {}
