import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReceptionistRole1711123736685 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO roles (name) VALUES ('receptionist');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM roles WHERE name = 'receptionist';`);
  }
}
