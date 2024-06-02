import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeDefaultBookingStatus1717045871182 implements MigrationInterface {
  name = 'ChangeDefaultBookingStatus1717045871182';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'booked'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'pending'`);
  }
}
