import { MigrationInterface, QueryRunner } from "typeorm";

export class Timestampz1750372284897 implements MigrationInterface {
    name = 'Timestampz1750372284897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "expires_at"`);
        await queryRunner.query(`ALTER TABLE "otps" ADD "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "expires_at"`);
        await queryRunner.query(`ALTER TABLE "otps" ADD "expires_at" TIMESTAMP NOT NULL`);
    }

}
