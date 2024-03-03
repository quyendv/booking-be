import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBookingTables1709485894647 implements MigrationInterface {
  name = 'CreateBookingTables1709485894647';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bookings" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_name" character varying NOT NULL, "hotel_owner_email" character varying NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "breakfast_included" boolean NOT NULL DEFAULT false, "currency" character varying NOT NULL DEFAULT 'VND', "total_price" numeric(14,2) NOT NULL, "is_paid" boolean NOT NULL DEFAULT false, "payment_channel" character varying NOT NULL, "payment_id" character varying NOT NULL, "payment_info" jsonb, "room_id" integer NOT NULL, "hotel_id" integer NOT NULL, "customer_id" character varying NOT NULL, CONSTRAINT "UQ_5c9bd37ff5ee2ad5dc0f5307c53" UNIQUE ("payment_id"), CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_0b0fc32fe6bd0119e281628df7a" FOREIGN KEY ("room_id") REFERENCES "hotel_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_a71eec827a2ac2285d6266d7120" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_8e21b7ae33e7b0673270de4146f" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_8e21b7ae33e7b0673270de4146f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_a71eec827a2ac2285d6266d7120"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_0b0fc32fe6bd0119e281628df7a"`,
    );
    await queryRunner.query(`DROP TABLE "bookings"`);
  }
}
