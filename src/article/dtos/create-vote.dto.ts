import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { VoteType } from '@prisma/client';

export class CreateVoteDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsEnum(VoteType)
  voteType: VoteType;
}
