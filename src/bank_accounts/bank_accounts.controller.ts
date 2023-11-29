import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { BankAccountsService } from './bank_accounts.service';
import { CreateBankAccountDto } from './dto/create-bank_account.dto';
import { UpdateBankAccountDto } from './dto/update-bank_account.dto';
import { ApiExcludeController } from '@nestjs/swagger';
@ApiExcludeController()
@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Post()
  create(@Body() createBankAccountDto: CreateBankAccountDto) {
    return this.bankAccountsService.create(createBankAccountDto);
  }

  @Get()
  findAll() {
    return this.bankAccountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankAccountsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
  ) {
    return this.bankAccountsService.update(id, updateBankAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankAccountsService.remove(id);
  }

  @Get('status/:id/:status')
  updateStatus(@Param('id') id: string, @Param('status') status: string) {
    return this.bankAccountsService.updateStatus(id, status);
  }
  @Get('logout/:id')
  logout(@Param('id') id: string) {
    return this.bankAccountsService.logout(id);
  }

  @Get('resume/:id/:status')
  updateResume(@Param('id') id: string, @Param('status') status: string) {
    return this.bankAccountsService.updateResume(id, status);
  }

  @Get('login/:id/:status/:user/:username')
  updateLogin(
    @Param('id') id: string,
    @Param('status') status: string,
    @Param('user') user: string,
    @Param('username') username: string,
  ) {
    return this.bankAccountsService.updateLogin(id, status, user, username);
  }

  @Get('loginned-account/:user')
  getLoginnedAccount(@Param('user') user: string) {
    return this.bankAccountsService.getLoginnedAccount(user);
  }

  @Get('details/:id')
  getDetails(@Param('id') id: string) {
    return this.bankAccountsService.getDetails(id);
  }
  @Post('details/:id')
  updateDetails(@Param('id') id: string, @Body() update: any) {
    const upt = [update];
    return this.bankAccountsService.updateDetails(id, upt[0]);
  }

  @Post('bank-details/:id')
  updateBankDetails(@Param('id') id: string, @Body() update: any) {
    const upt = [update];
    return this.bankAccountsService.pushBankDetails(id, upt[0]);
  }

  @Put(':id/authenticate')
  async authenticateBankAccount(
    @Param('id') id: string,
    @Body() authenticationData: any,
  ) {
    let { loginStatus, user, username } = authenticationData;
    return this.bankAccountsService.authenticateBankAccount(
      id,
      loginStatus,
      (user = user ? user : null),
      (username = username ? username : null),
    );
  }

  @Get('chatId/:id')
  getChatId(@Param('id') id: string) {
    return this.bankAccountsService.getTelegramId(id);
  }
}
