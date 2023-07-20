CREATE TABLE `szkodnicy` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`uuid` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`login` VARCHAR(32) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`password` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`userlevel` VARCHAR(255)  DEFAULT NULL COLLATE 'utf8mb4_general_ci'
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=3
;

mysql://root:@localhost:3306/funnygameroutes