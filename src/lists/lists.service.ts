import { Inject, Injectable } from '@nestjs/common';
import {
  DATABASE_SERVICE,
  DatabaseService,
} from 'src/database/database.constants';
import { listsTable } from './entities/list.entity';
import { eq } from 'drizzle-orm';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListsService {
  constructor(
    @Inject(DATABASE_SERVICE) private readonly databaseService: DatabaseService,
  ) {}

  /**
   * @returns List ID
   */
  async create(accountId: string, title: string) {
    const id = crypto.randomUUID();
    await this.databaseService.insert(listsTable).values({
      id,
      accountId,
      title,
    });
    return id;
  }

  async update(listId: string, updateListDto: UpdateListDto) {
    const [updatedList] = await this.databaseService
      .update(listsTable)
      .set(updateListDto)
      .where(eq(listsTable.id, listId))
      .returning({ id: listsTable.id });
    return typeof updatedList?.id === 'string';
  }

  async get(id: string) {
    return this.databaseService.query.listsTable.findFirst({
      where: eq(listsTable.id, id),
      with: {
        todos: {
          columns: {
            listId: false,
          },
        },
      },
      columns: {
        accountId: false,
      },
    });
  }

  async getAll(accountId: string) {
    return this.databaseService.query.listsTable.findMany({
      where: eq(listsTable.accountId, accountId),
      columns: {
        accountId: false,
      },
    });
  }

  async delete(listId: string) {
    const [deletedList] = await this.databaseService
      .delete(listsTable)
      .where(eq(listsTable.id, listId))
      .returning({
        id: listsTable.id,
      });
    return typeof deletedList?.id === 'string';
  }
}
