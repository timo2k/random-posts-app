import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDto, RegisterUserDto } from './dtos/user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterUserDto, description: 'User name and password' })
  @ApiOkResponse({ description: 'Registration successful' })
  async register(@Body() registerUserDto: RegisterUserDto) {
    const { email, displayName, password } = registerUserDto;

    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    await this.userService.createUser({ email, displayName, password });
    return { message: 'User registered successfully' };
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginUserDto, description: 'User name and password' })
  @ApiOkResponse({ description: 'Login successful' })
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
