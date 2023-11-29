import { Controller, Post, Body } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { CreateVerifyDto } from './dto/create-verify.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Bank Transfer Deposit Verify')
@Controller('api/deposit/verify')
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) {}

  @ApiBody({
    type: CreateVerifyDto,
    description: 'Verify a deposit',
  })
  @Post()
  create(@Body() createVerifyDto: CreateVerifyDto) {
    return this.verifyService.create(createVerifyDto);
  }
}
