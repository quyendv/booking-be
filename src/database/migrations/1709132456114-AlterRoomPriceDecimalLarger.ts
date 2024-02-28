import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterRoomPriceDecimalLarger1709132456114 implements MigrationInterface {
  name = 'AlterRoomPriceDecimalLarger1709132456114';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hotel_rooms" ALTER COLUMN "breakfast_price" TYPE numeric(14,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_rooms" ALTER COLUMN "room_price" TYPE numeric(14,2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hotel_rooms" ALTER COLUMN "room_price" TYPE numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_rooms" ALTER COLUMN "breakfast_price" TYPE numeric(7,2)`,
    );
  }
}
