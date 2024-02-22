import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHotelsTable1708531391659 implements MigrationInterface {
  name = 'CreateHotelsTable1708531391659';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "hotels" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" character varying NOT NULL, "image_url" character varying NOT NULL, "image_key" character varying NOT NULL, "gym" boolean NOT NULL, "bar" boolean NOT NULL, "restaurant" boolean NOT NULL, "free_parking" boolean NOT NULL, "movie_night" boolean NOT NULL, "coffee_shop" boolean NOT NULL, "spa" boolean NOT NULL, "laundry" boolean NOT NULL, "shopping" boolean NOT NULL, "bike_rental" boolean NOT NULL, "swimming_pool" boolean NOT NULL, "address_id" integer NOT NULL, CONSTRAINT "REL_bf37c85874ec1747f5fa7836c9" UNIQUE ("address_id"), CONSTRAINT "PK_2bb06797684115a1ba7c705fc7b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotels" ADD CONSTRAINT "FK_bf37c85874ec1747f5fa7836c9a" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hotels" DROP CONSTRAINT "FK_bf37c85874ec1747f5fa7836c9a"`,
    );
    await queryRunner.query(`DROP TABLE "hotels"`);
  }
}
