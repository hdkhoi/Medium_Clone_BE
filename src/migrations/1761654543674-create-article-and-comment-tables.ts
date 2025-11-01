import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArticleAndCommentTables1761654543674
  implements MigrationInterface
{
  name = 'CreateArticleAndCommentTables1761654543674';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`articles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`tagList\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`authorId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`comments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`body\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`authorId\` int NULL, \`articleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`created_at\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updated_at\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_65d9ccc1b02f4d904e90bd76a34\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_4548cc4a409b8651ec75f70e280\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_b0011304ebfcb97f597eae6c31f\` FOREIGN KEY (\`articleId\`) REFERENCES \`articles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_b0011304ebfcb97f597eae6c31f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_4548cc4a409b8651ec75f70e280\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_65d9ccc1b02f4d904e90bd76a34\``,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updated_at\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`updated_at\` timestamp(0) NULL DEFAULT 'NULL' ON UPDATE CURRENT_TIMESTAMP()`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`created_at\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP()`,
    );
    await queryRunner.query(`DROP TABLE \`comments\``);
    await queryRunner.query(`DROP TABLE \`articles\``);
  }
}
