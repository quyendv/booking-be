import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '~/customers/entities/customer.entity';
import { StorageService } from '~/storage/storage.service';
import { RoleEntity } from '~/users/entities/role.entity';
import { UserEntity } from '~/users/entities/user.entity';
import { RoleService } from '~/users/sub-services/role.service';
import { UserService } from '~/users/user.service';
import { HotelEntity } from '../entities/hotel.entity';
import { RoomEntity } from '../entities/room.entity';
import { HotelService } from '../hotel.service';
import { RoomService } from '../sub-services/room.service';
import { CustomerService } from '~/customers/customer.service';
import { AddressService } from '~/address/address.service';
import { AddressEntity } from '~/address/entities/address.entity';
import { RoleTypes } from '~/users/constants/user.constant';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('HotelService', () => {
  let hotelService: HotelService;
  let hotelRepository: Repository<HotelEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HotelService,
        RoomService,
        UserService,
        StorageService,
        RoleService,
        ConfigService,
        CustomerService,
        AddressService,
        {
          provide: getRepositoryToken(HotelEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(RoomEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(RoleEntity),
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
      ],
    }).compile();

    hotelService = module.get<HotelService>(HotelService);
    hotelRepository = module.get<Repository<HotelEntity>>(getRepositoryToken(HotelEntity));
  });

  it('should be defined', () => {
    expect(hotelService).toBeDefined();
  });

  // describe('_findOne', () => {
  describe('getHotelByEmail', () => {
    it('should return a hotel when provided valid email', async () => {
      const hotel = new HotelEntity();
      hotel.email = 'test@example.com';

      jest.spyOn(hotelRepository, 'findOne').mockResolvedValue(hotel);

      const result = await hotelService._findOne({ where: { email: hotel.email } });
      expect(result).toEqual(hotel);
    });

    it('should return null when no hotel is found', async () => {
      jest.spyOn(hotelRepository, 'findOne').mockResolvedValue(null);

      const result = await hotelService._findOne({ where: { email: 'test@example.com' } });
      expect(result).toBeNull();
    });
  });

  describe('getMyHotel', () => {
    it('should return hotel when user role is HOTEL_MANAGER', async () => {
      const user: UserEntity = {
        id: 'test@example.com',
        roleName: RoleTypes.HOTEL_MANAGER,
        // role: { id: 2, name: RoleTypes.HOTEL_MANAGER },
      } as any;

      const hotel: HotelEntity = {
        email: 'test@example.com',
      } as any;

      jest.spyOn(hotelService, 'getHotelByEmail').mockResolvedValue(hotel);

      const result = await hotelService.getMyHotel(user);
      expect(result).toEqual(hotel);
    });

    it('should return hotel when user role is RECEPTIONIST', async () => {
      const user: UserEntity = {
        id: 'receptionist@example.com',
        roleName: RoleTypes.RECEPTIONIST,
        // role: { id: 2, name: RoleTypes.RECEPTIONIST },
      } as any;

      const hotel: HotelEntity = {
        email: 'test@example.com',
        receptionists: [{ id: 'receptionist@example.com' }],
      } as any;

      jest.spyOn(hotelService, 'getReceptionistHotel').mockResolvedValue(hotel);

      const result = await hotelService.getMyHotel(user);
      expect(result).toEqual(hotel);
    });

    it('should throw ForbiddenException when user role is not HOTEL_MANAGER or RECEPTIONIST', async () => {
      const user: UserEntity = {
        id: 'test@example.com',
        role: { id: 2, name: 'INVALID_ROLE' },
      } as any;

      await expect(hotelService.getMyHotel(user)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('get hotel which receptionist serve', () => {
    it('should return hotel when provided valid user id', async () => {
      const user = new UserEntity();
      user.id = 'test-id';

      const hotel = new HotelEntity();
      hotel.email = 'test@example.com';

      jest.spyOn(hotelService, 'getReceptionistHotel').mockResolvedValue(hotel);

      const result = await hotelService.getReceptionistHotel(user.id, { rooms: true });
      expect(result).toEqual(hotel);
    });

    it('should throw error when no hotel is found', async () => {
      const user = new UserEntity();
      user.id = 'test-id';

      // jest.spyOn(hotelService, 'getReceptionistHotel').mockResolvedValue(null);
      // const result = await hotelService.getReceptionistHotel(user.id, { rooms: true });
      // expect(result).toBeNull();

      jest.spyOn(hotelService, '_findOne').mockResolvedValue(null);
      await expect(hotelService.getReceptionistHotel(user.id, { rooms: true })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
