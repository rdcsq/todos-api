import { Inject, Injectable } from '@nestjs/common';
import {
  DATABASE_SERVICE,
  DatabaseService,
} from 'src/database/database.constants';
import * as argon2 from 'argon2';
import { accountsTable, sessionsTable } from 'src/database/database.schema';
import { eq } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';
import { Session } from './entities/session.payload';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_SERVICE) private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * @param id Account ID
   * @returns Password, `null` if account doesn't have a password set or `undefined` if account doesn't exist.
   */
  async verifyPasswordFromAccountID(id: string, password: string) {
    const account = await this.databaseService.query.accountsTable.findFirst({
      where: eq(accountsTable.id, id),
      columns: {
        password: true,
      },
    });

    return (
      account &&
      account.password &&
      (await argon2.verify(account.password, password))
    );
  }

  async updatePassword(
    accountId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    if (!(await this.verifyPasswordFromAccountID(accountId, oldPassword)))
      return false;
    await this.setPassword(accountId, newPassword);
    return true;
  }

  async setPassword(accountId: string, password: string) {
    const passwordHash = await argon2.hash(password);
    await this.databaseService
      .update(accountsTable)
      .set({ password: passwordHash })
      .where(eq(accountsTable.id, accountId));
  }

  /**
   * @returns JWT
   */
  async createSession(accountId: string) {
    const sessionId = crypto.randomUUID();

    await this.databaseService.insert(sessionsTable).values({
      id: sessionId,
      accountId,
      origin: 'TODO',
    });

    return this.jwtService.sign({
      sessionId,
      accountId,
    } satisfies Session);
  }
}
