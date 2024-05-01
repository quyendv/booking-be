import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameColumnsInHotelAndReviewTable1714536617135 implements MigrationInterface {
  name = 'RenameColumnsInHotelAndReviewTable1714536617135';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reviews" RENAME COLUMN "staffRating" TO "staff_rating"`);
    await queryRunner.query(
      `ALTER TABLE "reviews" RENAME COLUMN "facilityRating" TO "facility_rating"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" RENAME COLUMN "cleanlinessRating" TO "cleanliness_rating"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" RENAME COLUMN "comfortRating" TO "comfort_rating"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" RENAME COLUMN "valueForMoneyRating" TO "value_for_money_rating"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" RENAME COLUMN "locationRating" TO "location_rating"`,
    );
    await queryRunner.query(`ALTER TABLE "hotels" RENAME COLUMN "allowPets" TO "allow_pets"`);
    await queryRunner.query(`ALTER TABLE "hotels" RENAME COLUMN "allowSmoking" TO "allow_smoking"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hotels" RENAME COLUMN "allow_smoking" TO "allowSmoking"`);
    await queryRunner.query(`ALTER TABLE "hotels" RENAME COLUMN "allow_pets" TO "allowPets"`);
    await queryRunner.query(
      `ALTER TABLE "reviews" RENAME COLUMN "location_rating" TO "locationRating"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" RENAME COLUMN "value_for_money_rating" TO "valueForMoneyRating"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" RENAME COLUMN "comfort_rating" TO "comfortRating"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" RENAME COLUMN "cleanliness_rating" TO "cleanlinessRating"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" RENAME COLUMN "facility_rating" TO "facilityRating"`,
    );
    await queryRunner.query(`ALTER TABLE "reviews" RENAME COLUMN "staff_rating" TO "staffRating"`);
  }
}
