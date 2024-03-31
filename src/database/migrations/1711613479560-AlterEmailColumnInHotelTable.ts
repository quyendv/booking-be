import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterEmailColumnInHotelTable1711613479560 implements MigrationInterface {
  name = 'AlterEmailColumnInHotelTable1711613479560';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hotels" RENAME COLUMN "email" TO "manager_email"`);
    await queryRunner.query(
      `ALTER TABLE "hotels" RENAME CONSTRAINT "UQ_bf2e1d96bdc6d87b1713070de24" TO "UQ_9b64f8207f30a75cf0a36b9c182"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hotels" RENAME CONSTRAINT "UQ_9b64f8207f30a75cf0a36b9c182" TO "UQ_bf2e1d96bdc6d87b1713070de24"`,
    );
    await queryRunner.query(`ALTER TABLE "hotels" RENAME COLUMN "manager_email" TO "email"`);
  }
}
