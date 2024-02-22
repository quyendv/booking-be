import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterDefaultValuesInHotels1708538396639 implements MigrationInterface {
  name = 'AlterDefaultValuesInHotels1708538396639';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "gym" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "bar" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "restaurant" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "free_parking" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "movie_night" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "coffee_shop" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "spa" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "laundry" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "shopping" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "bike_rental" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "swimming_pool" SET DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "swimming_pool" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "bike_rental" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "shopping" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "laundry" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "spa" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "coffee_shop" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "movie_night" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "free_parking" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "restaurant" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "bar" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "gym" DROP DEFAULT`);
  }
}
