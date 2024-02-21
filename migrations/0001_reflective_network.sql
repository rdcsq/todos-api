CREATE TABLE IF NOT EXISTS "sessions" (
	"id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_used" timestamp DEFAULT now() NOT NULL,
	"origin" text NOT NULL,
	CONSTRAINT "session_pk" PRIMARY KEY("id","account_id"),
	CONSTRAINT "sessions_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "name" SET NOT NULL;