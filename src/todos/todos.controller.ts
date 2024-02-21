import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { AuthGuard } from 'src/auth/guards/user.guard';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createTodoDto: CreateTodoDto) {
    const id = await this.todosService.create(
      createTodoDto.listId,
      createTodoDto.title,
    );
    if (!id) throw new InternalServerErrorException();
    return { id };
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param() params: { id: string },
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    if (!(await this.todosService.update(params.id, updateTodoDto)))
      throw new BadRequestException();
    return;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param() params: { id: string }) {
    if (!(await this.todosService.delete(params.id)))
      throw new BadRequestException();
    return;
  }
}
