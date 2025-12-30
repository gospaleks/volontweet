import { Controller, Post } from '@nestjs/common';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Auth(AuthType.None)
  @Post('register')
  register(): void {
    return this.authService.register();
  }

  @Auth(AuthType.None)
  @Post('login')
  login(): void {
    return this.authService.login();
  }

  @Post('logout')
  logout(): void {
    return this.authService.logout();
  }

  @Post('refresh')
  refresh(): void {
    return this.authService.refresh();
  }
}
