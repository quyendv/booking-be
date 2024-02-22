import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGalleryHotelColumn1708613069878 implements MigrationInterface {
  name = 'AddGalleryHotelColumn1708613069878';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hotels" ADD "gallery" jsonb NOT NULL DEFAULT '[]'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "gallery"`);
  }
}
