import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup() {
    return 'I am sign up';
  }

  @Post('signin')
  login() {
    return 'I am sign in';
  }
}
