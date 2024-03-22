import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReceptionistTable1711128612713 implements MigrationInterface {
  name = 'CreateReceptionistTable1711128612713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "receptionists" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" character varying NOT NULL, "name" character varying NOT NULL, "avatar" character varying, "avatarKey" character varying, "birthday" date, "phone" character varying, "gender" character varying, "hotel_id" integer NOT NULL, CONSTRAINT "PK_3b6a7c2ad5ecae4a8a162089020" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "receptionists" ADD CONSTRAINT "FK_7e6ae67544799b72718be3368e7" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "receptionists" DROP CONSTRAINT "FK_7e6ae67544799b72718be3368e7"`,
    );
    await queryRunner.query(`DROP TABLE "receptionists"`);
  }
}
