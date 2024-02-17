import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWardColumnToAddressTable1708198466872 implements MigrationInterface {
  name = 'AddWardColumnToAddressTable1708198466872';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "addresses" ADD "ward" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "ward"`);
  }
}
