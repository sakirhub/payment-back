import { Controller, Post, Body } from '@nestjs/common';
import { MethodService } from './method.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Get Bank Transfer Methods')
@Controller('api/bank-trasfer/methods')
export class MethodController {
  constructor(private readonly methodService: MethodService) {}

  @ApiBody({
    description: 'Create a new method',
    examples: {
      access_token: {
        value: {
          access_token: 'f78ca536e0da8fc1c06803a47c7a2f23d7b8ede0',
        },
        description: 'Get all methods',
      },
    },
  })
  @Post()
  create(@Body() createMethodDto: any) {
    return this.methodService.create(createMethodDto);
  }
}
