import { Types } from 'mongoose';

export class CreateTeamDto {
  name: string;
  site: Types.ObjectId;
}
