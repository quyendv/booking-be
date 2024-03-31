import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTimeRulesNotNull1711908857333 implements MigrationInterface {
  name = 'AlterTimeRulesNotNull1711908857333';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "time_rules" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "time_rules" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "time_rules" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "time_rules" DROP NOT NULL`);
  }
}
