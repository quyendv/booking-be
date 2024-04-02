import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { GalleryItemDto } from './create-hotel.dto';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsString()
  imageKey: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GalleryItemDto)
  gallery?: GalleryItemDto[];

  @IsOptional()
  @IsInt()
  bedCount: number;

  @IsOptional()
  @IsInt()
  guestCount: number;

  @IsOptional()
  @IsInt()
  bathroomCount: number;

  @IsOptional()
  @IsInt()
  kingBed: number;

  @IsOptional()
  @IsInt()
  queenBed: number;

  @IsOptional()
  @IsNumber()
  breakFastPrice: number;

  @IsOptional()
  @IsNumber()
  roomPrice: number;

  @IsOptional()
  @IsBoolean()
  roomService: boolean;

  @IsOptional()
  @IsBoolean()
  tv: boolean;

  @IsOptional()
  @IsBoolean()
  balcony: boolean;

  @IsOptional()
  @IsBoolean()
  freeWifi: boolean;

  @IsOptional()
  @IsBoolean()
  cityView: boolean;

  @IsOptional()
  @IsBoolean()
  oceanView: boolean;

  @IsOptional()
  @IsBoolean()
  forestView: boolean;

  @IsOptional()
  @IsBoolean()
  mountainView: boolean;

  @IsOptional()
  @IsBoolean()
  airCondition: boolean;

  @IsOptional()
  @IsBoolean()
  soundProofed: boolean;
}
