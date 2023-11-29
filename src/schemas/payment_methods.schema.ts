import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'paymentmethods' })
export class PaymentMethod extends Document {
  @Prop()
  id: number;
  @Prop({ index: true })
  name: string;
  @Prop()
  status: number;
  @Prop()
  logo: string;
  @Prop()
  created_by: string;
  @Prop()
  created: Date;
  @Prop()
  updated: Date;
}

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);
