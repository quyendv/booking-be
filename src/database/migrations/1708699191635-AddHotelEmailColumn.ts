import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHotelEmailColumn1708699191635 implements MigrationInterface {
  name = 'AddHotelEmailColumn1708699191635';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hotels" ADD "email" character varying NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "hotels" ADD CONSTRAINT "UQ_bf2e1d96bdc6d87b1713070de24" UNIQUE ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hotels" DROP CONSTRAINT "UQ_bf2e1d96bdc6d87b1713070de24"`,
    );
    await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "email"`);
  }
}
