import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async validateUser(userId: string): Promise<any> {
    const user = { id: userId };

    let hasUser;
    try {
      hasUser = await this.prisma.user.findUnique({
        where: { id: user.id },
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    if (!hasUser) {
      throw new UnauthorizedException('User not found');
    }

    return hasUser;
  }

  async login(user: any) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '5m' }),
      refresh_token: this.jwtService.sign(
        { ...payload, type: 'refresh' },
        { expiresIn: '7d' },
      ),
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.validateUser(payload.sub);
      return {
        access_token: this.jwtService.sign({ sub: user.id }),
        refresh_token: refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
