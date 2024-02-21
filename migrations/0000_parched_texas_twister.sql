CREATE TABLE IF NOT EXISTS "accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"password" text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_email_idx" ON "accounts" ("email");