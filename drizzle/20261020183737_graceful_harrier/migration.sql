CREATE TYPE "link_origin" AS ENUM('SYNC', 'MANUAL', 'AUTO_MATCH');--> statement-breakpoint
CREATE TABLE "classroom_external_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"classroom_id" uuid NOT NULL,
	"provider" "external_provider" NOT NULL,
	"external_id" varchar NOT NULL,
	"external_path" varchar,
	"metadata" jsonb,
	"sync_hash" varchar(255),
	"origin" "link_origin" NOT NULL,
	"last_synced_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "classroom_link_classroom_provider" UNIQUE("classroom_id","provider"),
	CONSTRAINT "classroom_link_provider_external_id" UNIQUE("provider","external_id")
);
--> statement-breakpoint
CREATE TABLE "institution_integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"institution_id" uuid NOT NULL,
	"credentials" text,
	"provider" "external_provider" NOT NULL,
	"external_id" varchar NOT NULL,
	"external_path" varchar,
	"metadata" jsonb,
	"sync_hash" varchar(255),
	"origin" "link_origin" NOT NULL,
	"last_synced_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "institution_integration_institution_provider" UNIQUE("institution_id","provider"),
	CONSTRAINT "institution_integration_provider_external_id" UNIQUE("provider","external_id")
);
--> statement-breakpoint
CREATE TABLE "unit_external_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"unit_id" uuid NOT NULL,
	"provider" "external_provider" NOT NULL,
	"external_id" varchar NOT NULL,
	"external_path" varchar,
	"metadata" jsonb,
	"sync_hash" varchar(255),
	"origin" "link_origin" NOT NULL,
	"last_synced_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unit_link_unit_provider" UNIQUE("unit_id","provider"),
	CONSTRAINT "unit_link_provider_external_id" UNIQUE("provider","external_id")
);
--> statement-breakpoint
ALTER TABLE "units" DROP CONSTRAINT "units_institutionId_institutions_id_fkey";--> statement-breakpoint
ALTER TABLE "classrooms" DROP CONSTRAINT "classroom_google_id_external_id";--> statement-breakpoint
ALTER TABLE "units" DROP CONSTRAINT "units_external_id_key";--> statement-breakpoint
ALTER TABLE "units" ADD COLUMN "institution_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "units" DROP COLUMN "external_id";--> statement-breakpoint
ALTER TABLE "units" DROP COLUMN "institutionId";--> statement-breakpoint
ALTER TABLE "classrooms" DROP COLUMN "google_classroom_id";--> statement-breakpoint
ALTER TABLE "classrooms" DROP COLUMN "external_id";--> statement-breakpoint
ALTER TABLE "institutions" DROP COLUMN "api_key";--> statement-breakpoint
ALTER TABLE "classroom_external_links" ADD CONSTRAINT "classroom_external_links_classroom_id_classrooms_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "institution_integrations" ADD CONSTRAINT "institution_integrations_institution_id_institutions_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "unit_external_links" ADD CONSTRAINT "unit_external_links_unit_id_units_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_institution_id_institutions_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id");