import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveAuthColumns1751800307991 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop the unique constraint on email first
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);

        // Drop authentication-related columns since they're now handled by external auth service
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email_verified"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_number"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Re-add the columns in reverse order
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "phone_number" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "email_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "last_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "first_name" character varying NOT NULL`);

        // Re-add the unique constraint on email
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
    }
}
