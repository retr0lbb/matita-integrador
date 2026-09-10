CREATE TYPE "account_status" AS ENUM('PENDING', 'CREATED', 'BLOCKED', 'WARNING');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('ALUNO', 'PROFESSOR', 'ADMIN');--> statement-breakpoint
CREATE TYPE "user_sync_mode" AS ENUM('NONE', 'ERP', 'HYBRID');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY,
	"external_id" uuid UNIQUE,
	"user_id" uuid NOT NULL,
	"email" varchar UNIQUE,
	"status" "account_status" DEFAULT 'PENDING'::"account_status" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY,
	"external_id" uuid UNIQUE,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"role" "user_role" NOT NULL,
	"sync_mode" "user_sync_mode" DEFAULT 'NONE'::"user_sync_mode" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;