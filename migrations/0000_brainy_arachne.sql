CREATE TABLE IF NOT EXISTS "accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lists" (
	"id" uuid PRIMARY KEY NOT NULL,
	"account_id" uuid NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_used" timestamp DEFAULT now() NOT NULL,
	"origin" text NOT NULL,
	CONSTRAINT "session_pk" PRIMARY KEY("id","account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todos" (
	"id" uuid PRIMARY KEY NOT NULL,
	"list_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_important" boolean DEFAULT false NOT NULL,
	"is_done" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_email_idx" ON "accounts" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_lists_idx" ON "lists" ("account_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "list_todos_idx" ON "todos" ("list_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lists" ADD CONSTRAINT "lists_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todos" ADD CONSTRAINT "todos_list_id_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
