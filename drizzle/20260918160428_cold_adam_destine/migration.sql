ALTER TABLE "classrooms" ADD COLUMN "google_classroom_id" varchar;--> statement-breakpoint
ALTER TABLE "classrooms" DROP COLUMN "location";--> statement-breakpoint
ALTER TABLE "classrooms" RENAME CONSTRAINT "classrooms_external_id_key" TO "classroom_google_id_external_id";--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_google_classroom_id_key" UNIQUE("google_classroom_id");--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_title_key" UNIQUE("title");--> statement-breakpoint
ALTER TABLE "classrooms" DROP CONSTRAINT "classroom_google_id_external_id";--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classroom_google_id_external_id" UNIQUE("google_classroom_id","external_id");