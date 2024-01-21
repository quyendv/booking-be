import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitRolesTable1705863452002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO roles (name) VALUES ('admin'), ('hotel'), ('customer');`,
      // `INSERT INTO roles (name) VALUES ${Object.values(RoleTypes)
      //   .map((role) => `('${role}')`)
      //   .join(', ')}
      // ;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM roles;`);
  }
}
