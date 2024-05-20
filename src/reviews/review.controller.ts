import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Roles } from '~/auth/decorators/role.decorator';
import { AuthUser } from '~/auth/decorators/user.decorator';
import { UserPayload } from '~/auth/types/request.type';
import { PermissionActions } from '~/auth/types/role.type';
import { CreateReviewDto } from '~/reviews/dtos/create-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { AbilityFactory } from '~/auth/abilities/ability.factory';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '~/auth/guards/auth.guard';
import { RolesGuard } from '~/auth/guards/role.guard';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { Public } from '~/auth/decorators/public.decorator';

@ApiTags('Reviews')
@Controller('reviews')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard, RolesGuard)
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly abilityService: AbilityFactory,
  ) {}

  @Post()
  @Roles([PermissionActions.CREATE, ReviewEntity])
  async createReview(
    @AuthUser() user: UserPayload,
    @Body() body: CreateReviewDto,
  ): Promise<ReviewEntity> {
    const ability = await this.abilityService.getAbilityByEmail(user.email);
    return this.reviewService.createReview(body, ability);
  }

  @Patch(':id')
  @Roles([PermissionActions.UPDATE, ReviewEntity])
  async updateReview(
    @Param('id') id: string,
    @AuthUser() user: UserPayload,
    @Body() body: UpdateReviewDto,
  ): Promise<ReviewEntity> {
    const ability = await this.abilityService.getAbilityByEmail(user.email);
    return this.reviewService.updateReview(id, body, ability);
  }

  @Get('hotels/:id')
  // @Roles([PermissionActions.LIST, ReviewEntity])
  @Public()
  async getReviewsByHotelId(@Param('id') hotelId: string): Promise<ReviewEntity[]> {
    return this.reviewService.listHotelReviews(+hotelId);
  }

  @Get('rooms/:id')
  @Roles([PermissionActions.LIST, ReviewEntity])
  async getReviewsByRoomId(@Param('id') roomId: string): Promise<ReviewEntity[]> {
    return this.reviewService.listRoomReviews(+roomId);
  }

  @Get('customers')
  @Roles([PermissionActions.LIST, ReviewEntity])
  async getReviewsByCustomer(@AuthUser() user: UserPayload): Promise<ReviewEntity[]> {
    return this.reviewService.listCustomerReviews(user.email);
  }
}
