import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EmailDto } from '~/base/dtos/base.dto';
import { RoleTypes } from '../constants/user.constant';

export class CreateUserDto extends EmailDto {
  @IsNotEmpty()
  @IsEnum(RoleTypes)
  roleName: RoleTypes;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  shouldCreateFirebaseUser?: boolean;

  @IsOptional()
  @IsString()
  password?: string;
}
