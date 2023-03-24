import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { VoteType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoteDto {
  @ApiProperty({
    description: 'The userId of the user',
    example: '1234',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The voteType of the vote',
    example: 'UPVOTE',
  })
  @IsNotEmpty()
  @IsEnum(VoteType)
  voteType: VoteType;
}
