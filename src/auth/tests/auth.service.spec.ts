import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressService } from '~/address/address.service';
import { AddressEntity } from '~/address/entities/address.entity';
import { CustomerService } from '~/customers/customer.service';
import { CustomerEntity } from '~/customers/entities/customer.entity';
import { MailerService } from '~/mailers/mailer.service';
import { RoleTypes } from '~/users/constants/user.constant';
import { RoleEntity } from '~/users/entities/role.entity';
import { UserEntity } from '~/users/entities/user.entity';
import { RoleService } from '~/users/sub-services/role.service';
import { UserService } from '~/users/user.service';
import { AuthService } from '../auth.service';
import { UserPayload } from '../types/request.type';
import { BaseResponse } from '~/base/types/response.type';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        ConfigService,
        MailerService,
        RoleService,
        CustomerService,
        AddressService,
        {
          // provide: 'UserEntityRepository',
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CustomerEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AddressEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(RoleEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a user when provided valid payload', async () => {
      const payload: UserPayload = {
        email: 'test@example.com',
        name: 'Test User',
        picture: 'http://example.com/pic.jpg',
      };
      const userEntity: UserEntity = {
        id: 'test@example.com',
        isVerified: true,
        role: { id: 1, name: RoleTypes.CUSTOMER },
      } as any;

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(userEntity);

      const result = await authService.signIn(payload);
      expect(result).toEqual(userEntity);
    });

    it('should throw an error when user not found', async () => {
      const payload: UserPayload = {
        email: 'test@example.com',
        name: 'Test User',
        picture: 'http://example.com/pic.jpg',
      };

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null);

      await expect(authService.signIn(payload)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signUp', () => {
    it('should return a success response when provided valid payload', async () => {
      const payload: UserPayload = {
        email: 'test@example.com',
        name: 'Test User',
        picture: 'http://example.com/pic.jpg',
      };
      const response: BaseResponse = { status: 'success', message: 'Verification email sent' };

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null);
      jest.spyOn(userService, 'createUnverifiedCustomer').mockResolvedValue({} as UserEntity);
      jest
        .spyOn(authService as any, 'generateVerifiedLink')
        .mockResolvedValue('http://example.com/verify-link');
      jest.spyOn(mailerService, 'sendEmail').mockResolvedValue('ok');

      const result = await authService.signUp(payload);
      expect(result).toEqual(response);
    });

    it('should throw an error when user already exists', async () => {
      const payload: UserPayload = {
        email: 'test@example.com',
        name: 'Test User',
        picture: 'http://example.com/pic.jpg',
      };
      const userEntity: UserEntity = {
        id: 'test@example.com',
        isVerified: true,
        role: { id: 1, name: RoleTypes.CUSTOMER },
      } as any;

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(userEntity);

      await expect(authService.signUp(payload)).rejects.toThrow(UnauthorizedException);
    });
  });
});
