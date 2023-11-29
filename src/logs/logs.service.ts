import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpAdapterHost } from '@nestjs/core';
import { Logs } from 'src/entities/logs.entity';

@Injectable()
export class LogsService implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @InjectRepository(Logs)
    private logsRepo?: Repository<Logs>,
  ) {}
  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: exception?.message,
    };
    // this.create({
    //   status_code:httpStatus.toString(),
    //   error_detail:exception,
    //   path:responseBody.path
    // })
    // this.findAll();
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  create(createLogDto: CreateLogDto) {
    return this.logsRepo?.create(createLogDto);
  }

  findAll() {
    return this.logsRepo?.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} log`;
  }

  update(id: number) {
    return `This action updates a #${id} log`;
  }

  remove(id: number) {
    return `This action removes a #${id} log`;
  }
}
