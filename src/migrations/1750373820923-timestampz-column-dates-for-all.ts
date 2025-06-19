import { MigrationInterface, QueryRunner } from "typeorm";

export class TimestampzColumnDatesForAll1750373820923 implements MigrationInterface {
    name = 'TimestampzColumnDatesForAll1750373820923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_vehicles" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user_vehicles" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "expires_at"`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "revoked_at"`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD "revoked_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "revoked_at"`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD "revoked_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "expires_at"`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD "expires_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_vehicles" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user_vehicles" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
