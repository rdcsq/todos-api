import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import {
  DATABASE_SERVICE,
  DatabaseService,
} from 'src/database/database.constants';
import { todosTable } from 'src/todos/entities/todo.entity';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @Inject(DATABASE_SERVICE) private readonly databaseService: DatabaseService,
  ) {}

  /**
   * @returns To-do ID
   */
  async create(listId: string, title: string) {
    const id = crypto.randomUUID();
    await this.databaseService.insert(todosTable).values({
      id,
      listId,
      title,
    });
    return id;
  }

  async update(todoId: string, updateTodoDto: UpdateTodoDto) {
    const [modifiedTodo] = await this.databaseService
      .update(todosTable)
      .set(updateTodoDto)
      .where(eq(todosTable.id, todoId))
      .returning({
        id: todosTable.id,
      });
    return typeof modifiedTodo?.id === 'string';
  }

  async delete(todoId: string) {
    const [deletedTodo] = await this.databaseService
      .delete(todosTable)
      .where(eq(todosTable.id, todoId))
      .returning({
        id: todosTable.id,
      });
    return typeof deletedTodo?.id === 'string';
  }
}
