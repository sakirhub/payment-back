import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermisionsService } from './permisions.service';
import { CreatePermisionDto } from './dto/create-permision.dto';
import { UpdatePermisionDto } from './dto/update-permision.dto';
import { ApiExcludeController } from '@nestjs/swagger';
@ApiExcludeController()
@Controller('permisions')
export class PermisionsController {
  constructor(private readonly permisionsService: PermisionsService) {}

  @Post()
  create(@Body() createPermisionDto: CreatePermisionDto) {
    return this.permisionsService.create(createPermisionDto);
  }

  @Get()
  findAll() {
    return this.permisionsService.findAll();
  }
  @Get('roles')
  findAllRoles() {
    return this.permisionsService.findAllRoles();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permisionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermisionDto: UpdatePermisionDto,
  ) {
    return this.permisionsService.update(+id, updatePermisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permisionsService.remove(+id);
  }
}
