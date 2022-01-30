import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTableBlogsAndAddBlogColumnInTableUser1643534759711 implements MigrationInterface {
    name = 'AddTableBlogsAndAddBlogColumnInTableUser1643534759711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blogs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "image_url" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "content" text NOT NULL, "authorId" uuid, CONSTRAINT "UQ_7b18faaddd461656ff66f32e2d7" UNIQUE ("slug"), CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_05aa4239904d894452e339e5139" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_05aa4239904d894452e339e5139"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
    }

}
