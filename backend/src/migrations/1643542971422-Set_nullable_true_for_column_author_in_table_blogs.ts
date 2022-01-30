import {MigrationInterface, QueryRunner} from "typeorm";

export class SetNullableTrueForColumnAuthorInTableBlogs1643542971422 implements MigrationInterface {
    name = 'SetNullableTrueForColumnAuthorInTableBlogs1643542971422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_05aa4239904d894452e339e5139"`);
        await queryRunner.query(`ALTER TABLE "blogs" ALTER COLUMN "authorId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_05aa4239904d894452e339e5139" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_05aa4239904d894452e339e5139"`);
        await queryRunner.query(`ALTER TABLE "blogs" ALTER COLUMN "authorId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_05aa4239904d894452e339e5139" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
