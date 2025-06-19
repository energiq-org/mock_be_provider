import { MigrationInterface, QueryRunner } from "typeorm";

export class TimestampzColumnDates1750373181154 implements MigrationInterface {
    name = 'TimestampzColumnDates1750373181154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "otps" ADD "code" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "otps" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "otps" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "otps" ADD "code" character varying(6) NOT NULL`);
    }

}
