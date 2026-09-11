ALTER TYPE "account_status" ADD VALUE 'DEACTIVATED';--> statement-breakpoint
CREATE TABLE "institutions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar NOT NULL,
	"api_key" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "email" SET NOT NULL;