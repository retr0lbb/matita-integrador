CREATE TYPE "external_provider" AS ENUM('LEX', 'GOOGLE');--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_external_id_key";--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "provider" "external_provider" NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "sync_hash" varchar(255);--> statement-breakpoint
ALTER TABLE "classrooms" ADD COLUMN "owner_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "classrooms" DROP COLUMN "shift";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "external_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "sync_mode";--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "classrooms" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"classroom_status";--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "unique_user_provider" UNIQUE("user_id","provider");--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_owner_id_users_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id");--> statement-breakpoint
DROP TYPE "classroom_shift";