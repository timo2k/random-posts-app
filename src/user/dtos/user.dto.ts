import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'affenscheisse@tester.de',
  })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'JohnDoe',
  })
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'affenscheisse@tester.de',
  })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
