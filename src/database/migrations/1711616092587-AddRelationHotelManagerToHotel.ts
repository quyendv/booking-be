import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationHotelManagerToHotel1711616092587 implements MigrationInterface {
  name = 'AddRelationHotelManagerToHotel1711616092587';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hotels" ADD CONSTRAINT "FK_9b64f8207f30a75cf0a36b9c182" FOREIGN KEY ("manager_email") REFERENCES "hotel_managers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hotels" DROP CONSTRAINT "FK_9b64f8207f30a75cf0a36b9c182"`,
    );
  }
}
