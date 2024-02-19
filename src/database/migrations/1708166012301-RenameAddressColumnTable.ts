import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameAddressColumnTable1708166012301 implements MigrationInterface {
  name = 'RenameAddressColumnTable1708166012301';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE addresses RENAME COLUMN address TO details;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE addresses RENAME COLUMN details TO address;`);
  }
}
