import { PartialType } from '@nestjs/swagger';
import { CreateMethodDto } from './create-method.dto';

export class UpdateMethodDto extends PartialType(CreateMethodDto) {}
