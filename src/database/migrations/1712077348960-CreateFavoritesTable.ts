import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFavoritesTable1712077348960 implements MigrationInterface {
  name = 'CreateFavoritesTable1712077348960';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "favorites" ("id" SERIAL NOT NULL, "customer_id" character varying NOT NULL, "hotel_id" integer NOT NULL, CONSTRAINT "UQ_67104c0a46874d11f28c8e61422" UNIQUE ("customer_id", "hotel_id"), CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_67104c0a46874d11f28c8e6142" ON "favorites" ("customer_id", "hotel_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_910d46f0ab3b071255bedd1732b" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_2e2b6dd49d72f029f48e30ae6fd" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorites" DROP CONSTRAINT "FK_2e2b6dd49d72f029f48e30ae6fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" DROP CONSTRAINT "FK_910d46f0ab3b071255bedd1732b"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_67104c0a46874d11f28c8e6142"`);
    await queryRunner.query(`DROP TABLE "favorites"`);
  }
}
