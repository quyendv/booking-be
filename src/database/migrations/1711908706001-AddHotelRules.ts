import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHotelRules1711908706001 implements MigrationInterface {
  name = 'AddHotelRules1711908706001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hotels" ADD "allowPets" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(
      `ALTER TABLE "hotels" ADD "allowSmoking" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "hotels" ADD "time_rules" jsonb`);
    await queryRunner.query(`ALTER TABLE "bookings" ADD "time_rules" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "time_rules"`);
    await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "time_rules"`);
    await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "allowSmoking"`);
    await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "allowPets"`);
  }
}
