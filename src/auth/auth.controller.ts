import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../filters';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ description: 'Token refresh successful' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }
}
