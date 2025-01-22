CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`date_posted` integer NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `date_posted_idx` ON `posts` (`date_posted`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `posts` (`slug`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`date_registered` integer NOT NULL,
	`subscribed` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscriptions_email_unique` ON `subscriptions` (`email`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `subscriptions` (`email`);--> statement-breakpoint
CREATE INDEX `date_registered_subscribed_idx` ON `subscriptions` (`date_registered`,`subscribed`);