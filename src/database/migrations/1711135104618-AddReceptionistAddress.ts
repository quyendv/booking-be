import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReceptionistAddress1711135104618 implements MigrationInterface {
  name = 'AddReceptionistAddress1711135104618';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "receptionists" ADD "address_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "receptionists" ADD CONSTRAINT "UQ_d7f2156799fe272e0929d3a8982" UNIQUE ("address_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "receptionists" ADD CONSTRAINT "FK_d7f2156799fe272e0929d3a8982" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "receptionists" DROP CONSTRAINT "FK_d7f2156799fe272e0929d3a8982"`,
    );
    await queryRunner.query(
      `ALTER TABLE "receptionists" DROP CONSTRAINT "UQ_d7f2156799fe272e0929d3a8982"`,
    );
    await queryRunner.query(`ALTER TABLE "receptionists" DROP COLUMN "address_id"`);
  }
}
