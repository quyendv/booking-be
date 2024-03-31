import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetUserRelationNotNull1711877428582 implements MigrationInterface {
  name = 'SetUserRelationNotNull1711877428582';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hotel_managers" DROP CONSTRAINT "FK_c8108058fbcdb9c9d3274864298"`,
    );
    await queryRunner.query(`ALTER TABLE "hotel_managers" ALTER COLUMN "user_id" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "receptionists" DROP CONSTRAINT "FK_fde5e1b9fcc6f5550e930098e2b"`,
    );
    await queryRunner.query(`ALTER TABLE "receptionists" ALTER COLUMN "user_id" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_11d81cd7be87b6f8865b0cf7661"`,
    );
    await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "user_id" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "hotel_managers" ADD CONSTRAINT "FK_c8108058fbcdb9c9d3274864298" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "receptionists" ADD CONSTRAINT "FK_fde5e1b9fcc6f5550e930098e2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_11d81cd7be87b6f8865b0cf7661" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_11d81cd7be87b6f8865b0cf7661"`,
    );
    await queryRunner.query(
      `ALTER TABLE "receptionists" DROP CONSTRAINT "FK_fde5e1b9fcc6f5550e930098e2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_managers" DROP CONSTRAINT "FK_c8108058fbcdb9c9d3274864298"`,
    );
    await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "user_id" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_11d81cd7be87b6f8865b0cf7661" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "receptionists" ALTER COLUMN "user_id" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "receptionists" ADD CONSTRAINT "FK_fde5e1b9fcc6f5550e930098e2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "hotel_managers" ALTER COLUMN "user_id" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "hotel_managers" ADD CONSTRAINT "FK_c8108058fbcdb9c9d3274864298" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
