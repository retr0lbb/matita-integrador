CREATE TYPE "classroom_shift" AS ENUM('MORNING', 'NIGHT', 'FULLTIME', 'OTHER');--> statement-breakpoint
CREATE TYPE "classroom_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TABLE "classrooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"external_id" uuid UNIQUE,
	"unit_id" uuid NOT NULL,
	"title" varchar NOT NULL,
	"location" varchar,
	"shift" "classroom_shift" DEFAULT 'MORNING'::"classroom_shift",
	"status" "classroom_status" DEFAULT 'ACTIVE'::"classroom_status"
);
--> statement-breakpoint
CREATE TABLE "classroom_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"classroom_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_unit_id_units_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id");--> statement-breakpoint
ALTER TABLE "classroom_users" ADD CONSTRAINT "classroom_users_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "classroom_users" ADD CONSTRAINT "classroom_users_classroom_id_classrooms_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id");