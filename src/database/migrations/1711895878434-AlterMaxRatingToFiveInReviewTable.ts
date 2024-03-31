import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterMaxRatingToFiveInReviewTable1711895878434 implements MigrationInterface {
  name = 'AlterMaxRatingToFiveInReviewTable1711895878434';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "staffRating" TYPE numeric(2,1)`);
    await queryRunner.query(
      `ALTER TABLE "reviews" ALTER COLUMN "facilityRating" TYPE numeric(2,1)`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ALTER COLUMN "cleanlinessRating" TYPE numeric(2,1)`,
    );
    await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "comfortRating" TYPE numeric(2,1)`);
    await queryRunner.query(
      `ALTER TABLE "reviews" ALTER COLUMN "valueForMoneyRating" TYPE numeric(2,1)`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ALTER COLUMN "locationRating" TYPE numeric(2,1)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reviews" ALTER COLUMN "locationRating" TYPE numeric(3,1)`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ALTER COLUMN "valueForMoneyRating" TYPE numeric(3,1)`,
    );
    await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "comfortRating" TYPE numeric(3,1)`);
    await queryRunner.query(
      `ALTER TABLE "reviews" ALTER COLUMN "cleanlinessRating" TYPE numeric(3,1)`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ALTER COLUMN "facilityRating" TYPE numeric(3,1)`,
    );
    await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "staffRating" TYPE numeric(3,1)`);
  }
}
