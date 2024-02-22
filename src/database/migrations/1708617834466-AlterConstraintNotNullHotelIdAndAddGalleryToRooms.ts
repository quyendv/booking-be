import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterConstraintNotNullHotelIdAndAddGalleryToRooms1708617834466
  implements MigrationInterface
{
  name = 'AlterConstraintNotNullHotelIdAndAddGalleryToRooms1708617834466';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hotel_rooms" ADD "gallery" jsonb NOT NULL DEFAULT '[]'`);
    await queryRunner.query(
      `ALTER TABLE "hotel_rooms" DROP CONSTRAINT "FK_371d751ab23caad7e7bf64e77ff"`,
    );
    await queryRunner.query(`ALTER TABLE "hotel_rooms" ALTER COLUMN "hotel_id" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "hotel_rooms" ADD CONSTRAINT "FK_371d751ab23caad7e7bf64e77ff" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hotel_rooms" DROP CONSTRAINT "FK_371d751ab23caad7e7bf64e77ff"`,
    );
    await queryRunner.query(`ALTER TABLE "hotel_rooms" ALTER COLUMN "hotel_id" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "hotel_rooms" ADD CONSTRAINT "FK_371d751ab23caad7e7bf64e77ff" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "hotel_rooms" DROP COLUMN "gallery"`);
  }
}
