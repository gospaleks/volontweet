import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { LoginAttemptLimiterService } from '../login-attempt-limiter.service';

@Injectable()
export class LoginAttemptGuard implements CanActivate {
  constructor(
    private readonly loginAttemptLimiter: LoginAttemptLimiterService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const email: string | undefined = request.body?.email;

    if (!email) {
      return true;
    }

    await this.loginAttemptLimiter.check(email);

    return true;
  }
}
