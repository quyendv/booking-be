import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsString()
  // @IsJWT() // slow, unnecessary
  verifyToken: string;
}
