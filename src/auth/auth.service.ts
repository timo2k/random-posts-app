import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(userId: string): Promise<any> {
    // Implement your user validation logic here.
    const user = { id: userId };
    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
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
