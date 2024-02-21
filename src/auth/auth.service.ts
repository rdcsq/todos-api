import { Inject, Injectable } from '@nestjs/common';
import {
  DATABASE_SERVICE,
  DatabaseService,
} from 'src/database/database.constants';
import * as argon2 from 'argon2';
import { accountsTable, sessionsTable } from 'src/database/database.schema';
import { and, eq } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';
import { Session } from './entities/session.payload';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_SERVICE) private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

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

  async getSession(sessionId: string, accountId: string) {
    return await this.databaseService.query.sessionsTable.findFirst({
      where: and(
        eq(sessionsTable.id, sessionId),
        eq(sessionsTable.accountId, accountId),
      ),
    });
  }
}
