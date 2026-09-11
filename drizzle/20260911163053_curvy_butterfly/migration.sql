CREATE TABLE "units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"external_id" uuid NOT NULL UNIQUE,
	"address" varchar,
	"alias" varchar NOT NULL UNIQUE,
	"institutionId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_institutionId_institutions_id_fkey" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id");