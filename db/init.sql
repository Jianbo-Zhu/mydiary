CREATE DATABASE IF NOT EXISTS mydiary;
USE mydiary;
-- mydiary.users definition

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `provider` varchar(50) NOT NULL,
  `provider_id` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  `activation_token` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_users_email` (`email`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;


-- mydiary.contacts definition

CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `notes` text,
  `tags` json DEFAULT NULL,
  `relation_to_me` varchar(64) DEFAULT NULL COMMENT '跟“我”的关系类型',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_contacts_id` (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `contacts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;


-- mydiary.diaries definition

CREATE TABLE `diaries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `tags` json DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `event_type` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `happened_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_diaries_id` (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `diaries_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;


-- mydiary.diary_contact definition

CREATE TABLE `diary_contact` (
  `diary_id` int NOT NULL,
  `contact_id` int NOT NULL,
  PRIMARY KEY (`diary_id`,`contact_id`),
  KEY `contact_id` (`contact_id`),
  CONSTRAINT `diary_contact_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`),
  CONSTRAINT `diary_contact_ibfk_2` FOREIGN KEY (`diary_id`) REFERENCES `diaries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- mydiary.relationships definition

CREATE TABLE `relationships` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `contact_id_1` int NOT NULL,
  `contact_id_2` int NOT NULL,
  `relation_type` varchar(64) NOT NULL,
  `notes` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_relationships_id` (`id`),
  KEY `user_id` (`user_id`),
  KEY `contact_id_1` (`contact_id_1`),
  KEY `contact_id_2` (`contact_id_2`),
  CONSTRAINT `relationships_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `relationships_ibfk_2` FOREIGN KEY (`contact_id_1`) REFERENCES `contacts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `relationships_ibfk_3` FOREIGN KEY (`contact_id_2`) REFERENCES `contacts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `relationship_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(64) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_relationship_type_user_name` (`user_id`, `name`),
  KEY `idx_relationship_type_user` (`user_id`),
  CONSTRAINT `relationship_type_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;