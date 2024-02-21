import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Session } from '../entities/session.payload';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) throw new UnauthorizedException();

    try {
      const payload: Session = await this.jwtService.verifyAsync(token);
      const session = await this.authService.getSession(
        payload.sessionId,
        payload.accountId,
      );
      if (!session) throw new UnauthorizedException();
      request['user'] = session.accountId;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
