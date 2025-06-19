import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1750290952243 implements MigrationInterface {
    name = "Initial1750290952243";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "otps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "email" character varying NOT NULL, "code" character varying(6) NOT NULL, "used" boolean NOT NULL DEFAULT false, "type" "public"."otps_type_enum" NOT NULL, "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "vehicles" ("id" SERIAL NOT NULL, "model" character varying NOT NULL, "availability" character varying NOT NULL, "range" character varying NOT NULL, "efficiency" character varying NOT NULL, "weight" character varying NOT NULL, "acceleration" character varying NOT NULL, "one_stop_range" character varying NOT NULL, "battery" character varying NOT NULL, "fastcharge" character varying NOT NULL, "towing" character varying NOT NULL, "cargo_volume" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "user_vehicles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "vehicle_id" integer NOT NULL, "connector_type" "public"."user_vehicles_connector_type_enum" NOT NULL, "actual_battery" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_52ca4813f0f3b54a6fe107cd9ed" UNIQUE ("user_id", "vehicle_id"), CONSTRAINT "PK_c0ef3339d4e101e4a27541228db" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "email_verified" boolean NOT NULL DEFAULT false, "phone_number" character varying, "profile_picture" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "refresh_token" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "revoked_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "otps" ADD CONSTRAINT "FK_3938bb24b38ad395af30230bded" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "user_vehicles" ADD CONSTRAINT "FK_6bf7b34f58a2cc949c4ffb9e452" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "user_vehicles" ADD CONSTRAINT "FK_9bebcb9eb7d9a82590764509cbd" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "tokens" ADD CONSTRAINT "FK_8769073e38c365f315426554ca5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_8769073e38c365f315426554ca5"`);
        await queryRunner.query(`ALTER TABLE "user_vehicles" DROP CONSTRAINT "FK_9bebcb9eb7d9a82590764509cbd"`);
        await queryRunner.query(`ALTER TABLE "user_vehicles" DROP CONSTRAINT "FK_6bf7b34f58a2cc949c4ffb9e452"`);
        await queryRunner.query(`ALTER TABLE "otps" DROP CONSTRAINT "FK_3938bb24b38ad395af30230bded"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_vehicles"`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
        await queryRunner.query(`DROP TABLE "otps"`);
    }
}
