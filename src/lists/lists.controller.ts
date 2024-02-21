import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from 'src/auth/guards/user.guard';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  async get(@Param() params: { id: string }) {
    const list = await this.listsService.get(params.id);
    if (!list) throw new BadRequestException();
    return list;
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAll(@Request() req: ExpressRequest) {
    return this.listsService.getAll(req.user as string);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Request() req: ExpressRequest,
    @Body() createListDto: CreateListDto,
  ) {
    const id = await this.listsService.create(
      req.user as string,
      createListDto.title,
    );
    if (!id) throw new InternalServerErrorException();
    return { id };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param() params: { id: string }) {
    if (!(await this.listsService.delete(params.id))) {
      throw new BadRequestException();
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param() params: { id: string },
    @Body() updateListDto: UpdateListDto,
  ) {
    if (!(await this.listsService.update(params.id, updateListDto))) {
      throw new BadRequestException();
    }
  }
}
