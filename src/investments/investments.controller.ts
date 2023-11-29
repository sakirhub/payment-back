import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Sse,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { Investment } from '../schemas/investments.schema';
import { updateInvestmentDto } from './dto/update-investment.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { fromEvent, map, Observable } from 'rxjs';
import { AuthGuard } from 'src/auth/auth.guard';
import { updateBankInvestmentDto } from './dto/update-bank-investment.dto';
import { ApiExcludeEndpoint, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('investments')
export class InvestmentsController {
  constructor(
    private readonly investmentsService: InvestmentsService,
    private eventEmitter: EventEmitter2,
  ) {}
  @ApiExcludeEndpoint()
  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query('page') page: number = 1,
    @Query('itemsPerPage') itemsPerPage: number = 200,
    @Request() req,
  ): Promise<{ data: Investment[]; totalPages: number }> {
    const theGroupId = req.group_id;
    const theSiteId = req.site_id;
    return this.investmentsService.findAll(
      page,
      itemsPerPage,
      theGroupId,
      theSiteId,
      req.user,
    );
  }
  @ApiExcludeEndpoint()
  @Get('pending')
  @UseGuards(AuthGuard)
  findAllPending(
    @Query('page') page: number = 1,
    @Query('itemsPerPage') itemsPerPage: number = 200,
    @Request() req,
  ): Promise<{ data: Investment[]; totalPages: number }> {
    const theGroupId = req.group_id;
    const theSiteId = req.site_id;
    return this.investmentsService.findAllPending(
      page,
      itemsPerPage,
      theGroupId,
      theSiteId,
      req.user,
    );
  }
  @ApiExcludeEndpoint()
  @Get('paid')
  @UseGuards(AuthGuard)
  findAllPaid(
    @Query('page') page: number = 1,
    @Query('itemsPerPage') itemsPerPage: number = 200,
    @Request() req,
  ): Promise<{ data: Investment[]; totalPages: number }> {
    const theGroupId = req.group_id;
    const theSiteId = req.site_id;
    return this.investmentsService.findAllPaid(
      page,
      itemsPerPage,
      theGroupId,
      theSiteId,
      req.user,
    );
  }
  @ApiExcludeEndpoint()
  @Get('unpaid')
  @UseGuards(AuthGuard)
  findAllUnPaid(
    @Query('page') page: number = 1,
    @Query('itemsPerPage') itemsPerPage: number = 200,
    @Request() req,
  ): Promise<{ data: Investment[]; totalPages: number }> {
    const theGroupId = req.group_id;
    const theSiteId = req.site_id;
    return this.investmentsService.findAllUnPaid(
      page,
      itemsPerPage,
      theGroupId,
      theSiteId,
      req.user,
    );
  }
  @ApiExcludeEndpoint()
  @Get('bank/:id')
  getBankAccountDailyInvestmentTotal(
    @Param('id') id: string,
  ): Promise<{ data: any }> {
    return this.investmentsService.getBankAccountDailyInvestmentTotal(id);
  }
  @ApiExcludeEndpoint()
  @Get('report')
  @UseGuards(AuthGuard)
  findPartialReport(
    @Query('rtype') rtype: string = 'daily',
    @Query('date') cDate: string,
    @Request() req,
  ) {
    const theGroupId = req.group_id;
    const theSiteId = req.site_id;
    return this.investmentsService.findPartialReport(
      theGroupId,
      theSiteId,
      rtype,
      cDate,
    );
  }
  @ApiExcludeEndpoint()
  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateInvestmentDto: updateInvestmentDto & { user: string },
  ) {
    return this.investmentsService.update(id, updateInvestmentDto);
  }
  @ApiExcludeEndpoint()
  @Patch('update/bank/:id')
  updateBank(
    @Param('id') id: string,
    @Body() updateBankInvestmentDto: updateBankInvestmentDto & { user: string },
  ) {
    return this.investmentsService.updateBank(id, updateBankInvestmentDto);
  }

  @ApiExcludeEndpoint()
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'newInvestment').pipe(
      map((data) => {
        return new MessageEvent('newInvestment', { data: data });
      }),
    );
  }
  @ApiExcludeEndpoint()
  @Sse('sse/update')
  sseUpdate(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'updateInvestment').pipe(
      map((data) => {
        return new MessageEvent('updateInvestment', { data: data });
      }),
    );
  }
  @ApiExcludeEndpoint()
  @Get('daily-total-amount')
  aggregateInvestments(): Promise<{ data: any }> {
    return this.investmentsService.dailyTotalAmount();
  }
  @ApiExcludeEndpoint()
  @Get('monthly-total-amount')
  aggregateMonthlyInvestments(): Promise<{ data: any }> {
    return this.investmentsService.monthlyTotalAmount();
  }
  @ApiExcludeEndpoint()
  @Get('yearly-total-amount')
  aggregateYearlyInvestments(): Promise<{ data: any }> {
    return this.investmentsService.yearlyTotalAmount();
  }

  @ApiExcludeEndpoint()
  @Get('daily-total-amount/:date')
  aggregateInvestmentsBySite(
    @Param('date') date: string,
  ): Promise<{ data: any }> {
    return this.investmentsService.getDailyInvestmentData(date);
  }

  @ApiTags('Investment Details')
  @ApiParam({
    name: 'id',
    example: '654cd09ebed634f242211d56',
  })
  @Get('/details/:id')
  getInvestmentDetails(@Param('id') id: string): Promise<Investment> {
    return this.investmentsService.getInvestmentDetails(id);
  }
}
