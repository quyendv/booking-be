import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { EmailDto } from '~/base/dto/base.dto';
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
}
