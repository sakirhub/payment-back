import { PartialType } from '@nestjs/swagger';
import { CreateVerifyDto } from './create-verify.dto';

export class UpdateVerifyDto extends PartialType(CreateVerifyDto) {}
