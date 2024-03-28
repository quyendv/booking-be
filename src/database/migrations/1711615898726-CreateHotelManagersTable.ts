import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHotelManagersTable1711615898726 implements MigrationInterface {
  name = 'CreateHotelManagersTable1711615898726';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "hotel_managers" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" character varying NOT NULL, "name" character varying NOT NULL, "avatar" character varying, "avatarKey" character varying, "birthday" date, "phone" character varying, "gender" character varying, "address_id" integer, CONSTRAINT "REL_95db1a7eb91775b491a83965f3" UNIQUE ("address_id"), CONSTRAINT "PK_8723a878e637537090c51feb8c5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_managers" ADD CONSTRAINT "FK_95db1a7eb91775b491a83965f3b" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hotel_managers" DROP CONSTRAINT "FK_95db1a7eb91775b491a83965f3b"`,
    );
    await queryRunner.query(`DROP TABLE "hotel_managers"`);
  }
}
