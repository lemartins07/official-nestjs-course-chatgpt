import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1741496884735 implements MigrationInterface {
  name = 'InitialSchema1741496884735';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" RENAME COLUMN "create_at" TO "created_at"`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_6bb58f2b6e30cb51a6504599f4" ON "transactions" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_c8d9f81e34f72c8844d4780419" ON "transactions" ("type", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_6bb58f2b6e30cb51a6504599f4" ON "transactions" ("userId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6bb58f2b6e30cb51a6504599f4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c8d9f81e34f72c8844d4780419"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6bb58f2b6e30cb51a6504599f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" RENAME COLUMN "created_at" TO "create_at"`,
    );
  }
}
