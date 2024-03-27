CREATE TABLE `elixir_blogTags` (
	`blogId` text(255) NOT NULL,
	`tagId` text(255) NOT NULL,
	PRIMARY KEY(`blogId`, `tagId`),
	FOREIGN KEY (`blogId`) REFERENCES `elixir_blogs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tagId`) REFERENCES `elixir_tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `elixir_blogs` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`creatorId` text(255),
	`slug` text(255) NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`author` text(255) NOT NULL,
	`createdTime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`lastEditTime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`public` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`creatorId`) REFERENCES `elixir_users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `elixir_companies` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`websiteUrl` text,
	`logoId` text(36)
);
--> statement-breakpoint
CREATE TABLE `elixir_coverphotos` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `elixir_eventTags` (
	`eventId` text(255) NOT NULL,
	`tagId` text(255) NOT NULL,
	PRIMARY KEY(`eventId`, `tagId`),
	FOREIGN KEY (`eventId`) REFERENCES `elixir_events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tagId`) REFERENCES `elixir_tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `elixir_events` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`creatorId` text(255),
	`title` text NOT NULL,
	`slug` text(255) NOT NULL,
	`description` text NOT NULL,
	`startTime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`endTime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`location` text NOT NULL,
	`link` text NOT NULL,
	`public` integer DEFAULT false NOT NULL,
	`lastEditTime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`photoId` text(36),
	FOREIGN KEY (`creatorId`) REFERENCES `elixir_users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `elixir_jobPostings` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`body` text NOT NULL,
	`companyId` text(255) NOT NULL,
	`photoId` text(255),
	`link` text,
	`public` integer DEFAULT false NOT NULL,
	`createdTime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`lastEditedTime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`expiration` integer NOT NULL,
	`creatorId` text(255),
	FOREIGN KEY (`companyId`) REFERENCES `elixir_companies`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`creatorId`) REFERENCES `elixir_users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `elixir_resetTokens` (
	`token` text(255) NOT NULL,
	`id` text(255) NOT NULL,
	`expires` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`id`, `token`),
	FOREIGN KEY (`id`) REFERENCES `elixir_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `elixir_resourceTags` (
	`resourceId` text(255) NOT NULL,
	`tagId` text(255) NOT NULL,
	PRIMARY KEY(`resourceId`, `tagId`),
	FOREIGN KEY (`resourceId`) REFERENCES `elixir_resources`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tagId`) REFERENCES `elixir_tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `elixir_resources` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`link` text NOT NULL,
	`public` integer DEFAULT false NOT NULL,
	`internal` integer DEFAULT false NOT NULL,
	`lastEditTime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`createdTime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `elixir_sessions` (
	`sessionToken` text(255) NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`expires`, `sessionToken`, `userId`)
);
--> statement-breakpoint
CREATE TABLE `elixir_sponsorships` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`message` text NOT NULL,
	`companyId` text(255),
	`public` integer DEFAULT false NOT NULL,
	`sponsorshipType` text(3),
	`expiration` integer NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`companyId`) REFERENCES `elixir_companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `elixir_tags` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`colour` text(7) DEFAULT '#000000' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `elixir_userYearsActive` (
	`id` text(255) NOT NULL,
	`year` integer NOT NULL,
	`group` text(3) NOT NULL,
	`role` text NOT NULL,
	`photo` text,
	PRIMARY KEY(`id`, `year`)
);
--> statement-breakpoint
CREATE TABLE `elixir_users` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`emailVerified` integer DEFAULT CURRENT_TIMESTAMP,
	`passwordHash` text(255) NOT NULL,
	`about` text,
	`image` text(255),
	`userRole` text(3) DEFAULT 'user' NOT NULL,
	`registeredTime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`retired` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `elixir_verificationTokens` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `elixir_blogs_slug_unique` ON `elixir_blogs` (`slug`);--> statement-breakpoint
CREATE INDEX `blogSlugIdx` ON `elixir_blogs` (`slug`);--> statement-breakpoint
CREATE INDEX `companyIdIdx` ON `elixir_companies` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `elixir_events_slug_unique` ON `elixir_events` (`slug`);--> statement-breakpoint
CREATE INDEX `eventSlugIdx` ON `elixir_events` (`slug`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `elixir_sessions` (`userId`);--> statement-breakpoint
CREATE INDEX `sponsorshipIdIdx` ON `elixir_sponsorships` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `elixir_tags_name_unique` ON `elixir_tags` (`name`);--> statement-breakpoint
CREATE INDEX `userIdIdx` ON `elixir_users` (`id`);