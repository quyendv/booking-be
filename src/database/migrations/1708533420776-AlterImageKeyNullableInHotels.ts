import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterImageKeyNullableInHotels1708533420776 implements MigrationInterface {
  name = 'AlterImageKeyNullableInHotels1708533420776';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "image_key" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "image_key" SET NOT NULL`);
  }
}
