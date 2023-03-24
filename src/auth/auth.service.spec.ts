import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user object with the given userId', async () => {
      const userId = '123';
      const user = await authService.validateUser(userId);

      expect(user).toEqual({ id: userId });
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens', async () => {
      const user = { id: '123' };
      const payload = { sub: user.id };
      const accessToken = 'access_token';
      const refreshToken = 'refresh_token';

      (jwtService.sign as jest.Mock).mockImplementationOnce(() => accessToken);
      (jwtService.sign as jest.Mock).mockImplementationOnce(() => refreshToken);

      const result = await authService.login(user);

      expect(result).toEqual({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(jwtService.sign).toHaveBeenNthCalledWith(1, payload);
      expect(jwtService.sign).toHaveBeenNthCalledWith(2, payload, {
        expiresIn: '7d',
      });
    });
  });

  describe('refreshToken', () => {
    it('should return new access and refresh tokens', async () => {
      const refreshToken = 'refresh_token';
      const newAccessToken = 'new_access_token';
      const userId = '123';
      const payload = { sub: userId };

      (jwtService.verify as jest.Mock).mockImplementationOnce(() => payload);
      authService.validateUser = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve({ id: userId }));
      (jwtService.sign as jest.Mock).mockImplementationOnce(
        () => newAccessToken,
      );

      const result = await authService.refreshToken(refreshToken);

      expect(result).toEqual({
        access_token: newAccessToken,
        refresh_token: refreshToken,
      });
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken);
      expect(authService.validateUser).toHaveBeenCalledWith(userId);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: userId });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const refreshToken = 'invalid_refresh_token';

      (jwtService.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(authService.refreshToken(refreshToken)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });
});
