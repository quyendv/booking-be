import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationToUserTable1711877035776 implements MigrationInterface {
  name = 'AddRelationToUserTable1711877035776';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "receptionists" ADD "user_id" character varying`);
    await queryRunner.query(
      `ALTER TABLE "receptionists" ADD CONSTRAINT "UQ_fde5e1b9fcc6f5550e930098e2b" UNIQUE ("user_id")`,
    );
    await queryRunner.query(`ALTER TABLE "customers" ADD "user_id" character varying`);
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "UQ_11d81cd7be87b6f8865b0cf7661" UNIQUE ("user_id")`,
    );
    await queryRunner.query(`ALTER TABLE "hotel_managers" ADD "user_id" character varying`);
    await queryRunner.query(
      `ALTER TABLE "hotel_managers" ADD CONSTRAINT "UQ_c8108058fbcdb9c9d3274864298" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "receptionists" ADD CONSTRAINT "FK_fde5e1b9fcc6f5550e930098e2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_11d81cd7be87b6f8865b0cf7661" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_managers" ADD CONSTRAINT "FK_c8108058fbcdb9c9d3274864298" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hotel_managers" DROP CONSTRAINT "FK_c8108058fbcdb9c9d3274864298"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_11d81cd7be87b6f8865b0cf7661"`,
    );
    await queryRunner.query(
      `ALTER TABLE "receptionists" DROP CONSTRAINT "FK_fde5e1b9fcc6f5550e930098e2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_managers" DROP CONSTRAINT "UQ_c8108058fbcdb9c9d3274864298"`,
    );
    await queryRunner.query(`ALTER TABLE "hotel_managers" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "UQ_11d81cd7be87b6f8865b0cf7661"`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "receptionists" DROP CONSTRAINT "UQ_fde5e1b9fcc6f5550e930098e2b"`,
    );
    await queryRunner.query(`ALTER TABLE "receptionists" DROP COLUMN "user_id"`);
  }
}
