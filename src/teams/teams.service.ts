import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Site } from '../schemas/sites.schema';
import { Model, Types } from 'mongoose';
import { Team } from '../schemas/teams.schema';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Site.name) private siteModel: Model<Site>,
    @InjectModel(Team.name) private teamModel: Model<Team>,
  ) {}
  async create(createTeamDto: CreateTeamDto) {
    try {
      const objectId = new Types.ObjectId(createTeamDto.site);
      const site = await this.siteModel.findOne({ _id: objectId });
      if (!site) {
        throw new Error('Site not found');
      }
      const team = new this.teamModel();
      team.name = createTeamDto.name;
      team.site = site._id;
      team.created = new Date();
      return team.save();
    } catch (error) {
      console.error('Error while saving team:', error);
      throw error;
    }
  }

  async findAll(site_id: string) {
    const search = site_id ? { site: new Types.ObjectId(site_id) } : {};
    return this.teamModel.find(search).populate('site');
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    const objectId = new Types.ObjectId(id);
    const team = await this.teamModel.findOne(objectId);
    if (!team) {
      throw new NotFoundException('Team not found.');
    }
    if (updateTeamDto.name) team.name = updateTeamDto.name;
    if (team.save()) {
      return team;
    }
  }

  async remove(id: string) {
    const objectId = new Types.ObjectId(id);
    try {
      return await this.teamModel.findByIdAndDelete(objectId).exec();
    } catch (error) {
      console.error('Error while deleting team:', error);
      throw new Error(error);
    }
  }
}
