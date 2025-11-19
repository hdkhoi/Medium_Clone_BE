import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFavouriteField1763227745492 implements MigrationInterface {
    name = 'AddFavouriteField1763227745492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_favorite_articles\` (\`article_id\` int NOT NULL, \`user_id\` int NOT NULL, INDEX \`IDX_e0e08ca4194585a4068c6d2f9d\` (\`article_id\`), INDEX \`IDX_c60904e8896cc251f8cde67697\` (\`user_id\`), PRIMARY KEY (\`article_id\`, \`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_4548cc4a409b8651ec75f70e280\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_b0011304ebfcb97f597eae6c31f\``);
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`authorId\` \`authorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`articleId\` \`articleId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_65d9ccc1b02f4d904e90bd76a34\``);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`authorId\` \`authorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`authorId\` \`authorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`articleId\` \`articleId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`authorId\` \`authorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_4548cc4a409b8651ec75f70e280\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_b0011304ebfcb97f597eae6c31f\` FOREIGN KEY (\`articleId\`) REFERENCES \`articles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_65d9ccc1b02f4d904e90bd76a34\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_favorite_articles\` ADD CONSTRAINT \`FK_e0e08ca4194585a4068c6d2f9d9\` FOREIGN KEY (\`article_id\`) REFERENCES \`articles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_favorite_articles\` ADD CONSTRAINT \`FK_c60904e8896cc251f8cde676978\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_favorite_articles\` DROP FOREIGN KEY \`FK_c60904e8896cc251f8cde676978\``);
        await queryRunner.query(`ALTER TABLE \`user_favorite_articles\` DROP FOREIGN KEY \`FK_e0e08ca4194585a4068c6d2f9d9\``);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_65d9ccc1b02f4d904e90bd76a34\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_b0011304ebfcb97f597eae6c31f\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_4548cc4a409b8651ec75f70e280\``);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`articleId\` \`articleId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_65d9ccc1b02f4d904e90bd76a34\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`articleId\` \`articleId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_b0011304ebfcb97f597eae6c31f\` FOREIGN KEY (\`articleId\`) REFERENCES \`articles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_4548cc4a409b8651ec75f70e280\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP INDEX \`IDX_c60904e8896cc251f8cde67697\` ON \`user_favorite_articles\``);
        await queryRunner.query(`DROP INDEX \`IDX_e0e08ca4194585a4068c6d2f9d\` ON \`user_favorite_articles\``);
        await queryRunner.query(`DROP TABLE \`user_favorite_articles\``);
    }

}
