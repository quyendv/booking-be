import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusBookingColumn1710062415815 implements MigrationInterface {
  name = 'AddStatusBookingColumn1710062415815';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD "status" character varying NOT NULL DEFAULT 'pending'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "status"`);
  }
}
