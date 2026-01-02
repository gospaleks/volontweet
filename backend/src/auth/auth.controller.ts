import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiResponse } from 'src/common/http/api-response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Auth(AuthType.None)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);

    return ApiResponse.success(
      { userId: result.id },
      'User registered successfully',
    );
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
