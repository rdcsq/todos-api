import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.constants';
import { accountsTable } from './entities/account.entity';
import { eq } from 'drizzle-orm';

@Injectable()
export class AccountsService {
  constructor(
    @Inject('DATABASE_SERVICE')
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * @returns Account ID
   */
  async create(name: string, email: string) {
    const id = crypto.randomUUID();
    await this.databaseService.insert(accountsTable).values({
      id,
      email,
      name,
    });
    return id;
  }

  async get(id: string) {
    return await this.databaseService.query.accountsTable.findFirst({
      where: eq(accountsTable.id, id),
      columns: {
        password: false,
      },
    });
  }
}
