import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReviewTables1710066056855 implements MigrationInterface {
  name = 'CreateReviewTables1710066056855';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reviews" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_name" character varying NOT NULL, "customer_image" character varying, "hotel_owner_email" character varying NOT NULL, "staffRating" numeric(2,1) NOT NULL DEFAULT '0', "facilityRating" numeric(2,1) NOT NULL DEFAULT '0', "cleanlinessRating" numeric(2,1) NOT NULL DEFAULT '0', "comfortRating" numeric(2,1) NOT NULL DEFAULT '0', "valueForMoneyRating" numeric(2,1) NOT NULL DEFAULT '0', "locationRating" numeric(2,1) NOT NULL DEFAULT '0', "comment" character varying, "booking_id" uuid NOT NULL, "room_id" integer NOT NULL, "hotel_id" integer NOT NULL, "customer_id" character varying NOT NULL, CONSTRAINT "REL_bbd6ac6e3e6a8f8c6e0e8692d6" UNIQUE ("booking_id"), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_61c1cf87e65ae4a38dc65d60945" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_2dc6375147f8700674ae40630ed" FOREIGN KEY ("room_id") REFERENCES "hotel_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_bbd6ac6e3e6a8f8c6e0e8692d63" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_4dd42f48aa60ad8c0d5d5c4ea5b" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_4dd42f48aa60ad8c0d5d5c4ea5b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_bbd6ac6e3e6a8f8c6e0e8692d63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_2dc6375147f8700674ae40630ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_61c1cf87e65ae4a38dc65d60945"`,
    );
    await queryRunner.query(`DROP TABLE "reviews"`);
  }
}
