import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Session } from '../entities/session.payload';
import {
  DATABASE_SERVICE,
  DatabaseService,
} from 'src/database/database.constants';
import { and, eq } from 'drizzle-orm';
import { sessionsTable } from '../entities/session.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(DATABASE_SERVICE)
    private readonly databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) throw new UnauthorizedException();

    try {
      const payload: Session = await this.jwtService.verifyAsync(token);
      const session = await this.databaseService.query.sessionsTable.findFirst({
        where: and(
          eq(sessionsTable.id, payload.sessionId),
          eq(sessionsTable.accountId, payload.accountId),
        ),
      });
      if (!session) throw new UnauthorizedException();
      request['user'] = session.accountId;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
