import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../filters';

@ApiTags('auth')
@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: Object, description: 'User ID' })
  @ApiOkResponse({ description: 'Login successful' })
  async login(@Body('userId') userId: string) {
    const user = await this.authService.validateUser(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    return this.authService.login(user);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: Object, description: 'Refresh token' })
  @ApiOkResponse({ description: 'Token refresh successful' })
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
