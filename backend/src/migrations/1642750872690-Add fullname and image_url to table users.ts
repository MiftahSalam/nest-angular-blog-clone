import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFullnameAndImageUrlToTableUsers1642750872690 implements MigrationInterface {
    name = 'AddFullnameAndImageUrlToTableUsers1642750872690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "fullname" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_acc0045795b9f7cde6e26efc023" UNIQUE ("fullname")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "image_url" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "image_url"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_acc0045795b9f7cde6e26efc023"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fullname"`);
    }

}
