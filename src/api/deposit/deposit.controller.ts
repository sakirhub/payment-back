import { Controller, Post, Body } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Bank Transfer Deposit')
@Controller({
  path: 'api/deposit',
})
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @ApiBody({
    type: CreateDepositDto,
    description: 'Create a new deposit',
  })
  @Post()
  create(@Body() createDepositDto: CreateDepositDto) {
    return this.depositService.create(createDepositDto);
  }
}
