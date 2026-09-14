ALTER TABLE "accounts" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
DROP TYPE "account_status";--> statement-breakpoint
CREATE TYPE "account_status" AS ENUM('PENDING', 'ACTIVE', 'FAILED');--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "status" SET DATA TYPE "account_status" USING "status"::"account_status";--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"account_status";