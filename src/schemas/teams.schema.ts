import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema()
export class Team extends Document {
  @Prop({ index: true })
  name: string;
  @Prop({ type: Types.ObjectId, ref: 'Site' })
  site: Types.ObjectId;
  @Prop({ type: Date, default: Date.now })
  created: Date;
  @Prop({ type: Date })
  updated: Date;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
