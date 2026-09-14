ALTER TABLE "classroom_users" ADD COLUMN "status" varchar DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "classroom_users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "classroom_users" ADD COLUMN "synced_at" timestamp;--> statement-breakpoint
DROP INDEX "userid_classroomid";--> statement-breakpoint
CREATE UNIQUE INDEX "userid_classroomid" ON "classroom_users" ("classroom_id","user_id");