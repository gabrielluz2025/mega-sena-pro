CREATE TABLE `aiStrategies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lotteryId` int NOT NULL,
	`strategyName` varchar(128) NOT NULL,
	`description` text,
	`weight` int NOT NULL DEFAULT 100,
	`accuracy` int NOT NULL DEFAULT 0,
	`totalPredictions` int NOT NULL DEFAULT 0,
	`correctPredictions` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aiStrategies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `aiSuggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lotteryId` int NOT NULL,
	`drawNumber` int,
	`suggestedNumbers` text NOT NULL,
	`confidence` int NOT NULL,
	`strategyBreakdown` text NOT NULL,
	`actualNumbers` text,
	`matches` int DEFAULT 0,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`drawnAt` timestamp,
	CONSTRAINT `aiSuggestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `aiTrainingLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`strategyId` int NOT NULL,
	`previousWeight` int NOT NULL,
	`newWeight` int NOT NULL,
	`reason` varchar(256),
	`accuracy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aiTrainingLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `draws` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lotteryId` int NOT NULL,
	`drawNumber` int NOT NULL,
	`numbers` text NOT NULL,
	`drawDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `draws_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lotteries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	`description` text,
	`totalNumbers` int NOT NULL,
	`numbersPerDraw` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lotteries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userAlerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lotteryId` int NOT NULL,
	`alertType` enum('critical_delay','accumulated_prize','hot_numbers') NOT NULL,
	`threshold` int,
	`enabled` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userAlerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userBets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lotteryId` int NOT NULL,
	`drawNumber` int,
	`betNumbers` text NOT NULL,
	`amount` int NOT NULL,
	`status` enum('pending','won','lost') NOT NULL DEFAULT 'pending',
	`matches` int DEFAULT 0,
	`prize` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`drawnAt` timestamp,
	CONSTRAINT `userBets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userWallet` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`totalSpent` int NOT NULL DEFAULT 0,
	`totalWon` int NOT NULL DEFAULT 0,
	`netProfit` int NOT NULL DEFAULT 0,
	`roi` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userWallet_id` PRIMARY KEY(`id`),
	CONSTRAINT `userWallet_userId_unique` UNIQUE(`userId`)
);
