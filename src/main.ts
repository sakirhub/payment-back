import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LogsService } from './logs/logs.service';
import { InvestmentsService } from './investments/investments.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
  });
  const AdapterHost = app.get(HttpAdapterHost);
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup('api/documentation', app, document);
  app.useGlobalFilters(new LogsService(AdapterHost));
  const investmentsService = app.get(InvestmentsService);
  investmentsService.handleCron();
  await app.listen(3003);
}
bootstrap();
