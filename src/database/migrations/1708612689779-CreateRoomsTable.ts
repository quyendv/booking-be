import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoomsTable1708612689779 implements MigrationInterface {
  name = 'CreateRoomsTable1708612689779';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "hotel_rooms" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "image_url" character varying NOT NULL, "image_key" character varying, "bed_count" integer NOT NULL DEFAULT '0', "guest_count" integer NOT NULL DEFAULT '0', "bathroom_count" integer NOT NULL DEFAULT '0', "king_bed" integer NOT NULL DEFAULT '0', "queen_bed" integer NOT NULL DEFAULT '0', "breakfast_price" numeric(7,2) NOT NULL, "room_price" numeric(10,2) NOT NULL, "room_service" boolean NOT NULL DEFAULT false, "tv" boolean NOT NULL DEFAULT false, "balcony" boolean NOT NULL DEFAULT false, "free_wifi" boolean NOT NULL DEFAULT false, "city_view" boolean NOT NULL DEFAULT false, "ocean_view" boolean NOT NULL DEFAULT false, "forest_view" boolean NOT NULL DEFAULT false, "mountain_view" boolean NOT NULL DEFAULT false, "air_condition" boolean NOT NULL DEFAULT false, "sound_proofed" boolean NOT NULL DEFAULT false, "hotel_id" integer, CONSTRAINT "PK_1d226a170f53beff6c64f10c3ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_rooms" ADD CONSTRAINT "FK_371d751ab23caad7e7bf64e77ff" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hotel_rooms" DROP CONSTRAINT "FK_371d751ab23caad7e7bf64e77ff"`,
    );
    await queryRunner.query(`DROP TABLE "hotel_rooms"`);
  }
}
