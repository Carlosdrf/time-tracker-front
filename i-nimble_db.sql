-- MariaDB dump 10.19  Distrib 10.6.16-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: i-nimble_db
-- ------------------------------------------------------
-- Server version	11.2.2-MariaDB-1:11.2.2+maria~ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `companies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'I-nimble, LLC','Remote services company'),(2,'test company','test company description');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies_users`
--

DROP TABLE IF EXISTS `companies_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `companies_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `companies_users_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `companies_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies_users`
--

LOCK TABLES `companies_users` WRITE;
/*!40000 ALTER TABLE `companies_users` DISABLE KEYS */;
INSERT INTO `companies_users` VALUES (1,1,34),(2,2,40);
/*!40000 ALTER TABLE `companies_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currencies`
--

DROP TABLE IF EXISTS `currencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `currencies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currencies`
--

LOCK TABLES `currencies` WRITE;
/*!40000 ALTER TABLE `currencies` DISABLE KEYS */;
INSERT INTO `currencies` VALUES (1,'USD','Dolares Americanos');
/*!40000 ALTER TABLE `currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,22,1),(2,33,1),(3,20,1),(5,37,1),(21,56,1),(22,57,1),(23,58,1),(24,59,1),(25,55,2),(26,60,1);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entries`
--

DROP TABLE IF EXISTS `entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `date` date NOT NULL,
  `status` int(11) NOT NULL COMMENT '0=started, 1=ended',
  `user_id` int(11) NOT NULL,
  `task_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tasks` (`task_id`),
  KEY `fk_user_time` (`user_id`),
  CONSTRAINT `fk_tasks` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_time` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=495 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entries`
--

LOCK TABLES `entries` WRITE;
/*!40000 ALTER TABLE `entries` DISABLE KEYS */;
INSERT INTO `entries` VALUES (52,'2023-02-15 18:17:38','2023-02-15 18:18:53','2023-02-15',1,8,1),(53,'2023-02-15 09:05:00','2023-02-15 18:31:00','2023-02-15',1,8,NULL),(54,'2023-02-16 06:00:00','2023-02-16 11:48:00','2023-02-16',1,8,NULL),(57,'2023-02-16 08:04:00','2023-02-16 14:52:29','2023-02-16',1,8,NULL),(59,'2023-02-17 08:00:00','2023-02-17 12:50:45','2023-02-17',1,8,NULL),(62,'2023-02-20 10:42:28','2023-02-20 11:15:53','2023-02-20',1,8,2),(66,'2023-03-02 11:05:00','2023-03-02 18:13:00','2023-03-02',1,8,6),(85,'2023-03-03 08:00:00','2023-03-03 16:00:00','2023-03-03',1,8,25),(86,'2023-03-20 12:58:11','2023-03-20 12:59:02','2023-03-20',1,8,26),(87,'2023-03-21 11:42:50','2023-03-21 11:43:58','2023-03-21',1,8,27),(88,'2023-03-21 11:40:18','2023-03-21 11:43:27','2023-03-21',1,1,28),(89,'2023-03-21 12:55:45','2023-03-21 13:00:50','2023-03-21',1,8,29),(90,'2023-03-22 12:50:40','2023-03-22 12:55:46','2023-03-22',1,8,30),(92,'2023-03-23 09:12:51','2023-03-23 17:15:56','2023-03-23',1,8,32),(93,'2023-03-27 15:52:09','2023-03-27 16:30:23','2023-03-27',1,8,33),(94,'2023-04-14 11:04:13','2023-04-14 11:50:19','2023-04-14',1,8,34),(95,'2023-04-14 14:09:32','2023-04-14 14:20:51','2023-04-14',1,8,35),(96,'2023-04-17 09:52:39','2023-04-17 11:00:05','2023-04-17',1,8,36),(97,'2023-04-17 11:01:32','2023-04-17 18:00:44','2023-04-17',1,8,37),(98,'2023-04-18 09:00:27','2023-04-18 09:20:18','2023-04-18',1,8,38),(99,'2023-04-18 09:45:06','2023-04-18 16:00:02','2023-04-18',1,8,39),(100,'2023-04-18 16:16:12','2023-04-18 17:16:42','2023-04-18',1,8,40),(101,'2023-04-19 09:00:08','2023-04-19 13:55:38','2023-04-19',1,8,41),(102,'2023-04-19 13:55:42','2023-04-19 15:06:06','2023-04-19',1,8,42),(103,'2023-04-19 15:06:18','2023-04-19 16:03:55','2023-04-19',1,8,43),(104,'2023-04-19 16:04:08','2023-04-19 18:00:53','2023-04-19',1,8,44),(105,'2023-04-20 09:00:21','2023-04-20 17:59:49','2023-04-20',1,8,45),(106,'2023-04-21 09:09:58','2023-04-21 14:32:54','2023-04-21',1,8,46),(107,'2023-04-21 14:33:01','2023-04-21 15:53:53','2023-04-21',1,8,47),(108,'2023-04-21 15:54:06','2023-04-21 18:16:01','2023-04-21',1,8,48),(109,'2023-04-24 09:43:10','2023-04-24 13:40:42','2023-04-24',1,8,49),(110,'2023-04-21 09:36:00','2023-04-21 12:36:02','2023-04-21',1,20,50),(111,'2023-04-24 09:41:11','2023-04-24 17:58:05','2023-04-24',1,20,51),(112,'2023-04-24 13:40:48','2023-04-24 14:40:46','2023-04-24',1,8,52),(113,'2023-04-24 14:54:11','2023-04-24 18:31:14','2023-04-24',1,8,53),(114,'2023-04-25 09:05:37','2023-04-25 17:56:43','2023-04-25',1,8,54),(115,'2023-04-25 09:08:03','2023-04-25 18:02:59','2023-04-25',1,20,55),(116,'2023-04-26 09:00:29','2023-04-26 13:48:32','2023-04-26',1,8,56),(117,'2023-04-26 09:32:01','2023-04-26 13:47:59','2023-04-26',1,20,57),(118,'2023-04-26 13:48:05','2023-04-26 17:59:55','2023-04-26',1,20,58),(119,'2023-04-26 13:50:26','2023-04-26 14:46:20','2023-04-26',1,8,59),(120,'2023-04-26 14:48:57','2023-04-26 18:00:58','2023-04-26',1,8,60),(121,'2023-04-27 08:37:56','2023-04-27 17:56:55','2023-04-27',1,8,61),(122,'2023-04-27 08:44:19','2023-04-27 17:40:52','2023-04-27',1,20,62),(123,'2023-04-28 08:45:29','2023-04-28 11:18:51','2023-04-28',1,8,63),(124,'2023-04-28 09:15:43','2023-04-28 18:28:12','2023-04-28',1,20,64),(130,'2023-04-28 11:20:14','2023-04-28 12:08:09','2023-04-28',1,8,70),(131,'2023-04-28 12:09:21','2023-04-28 13:10:20','2023-04-28',1,8,71),(142,'2023-04-28 13:11:57','2023-04-28 14:14:02','2023-04-28',1,8,82),(144,'2023-04-28 14:15:39','2023-04-28 14:27:07','2023-04-28',1,8,84),(146,'2023-04-28 14:28:40','2023-04-28 15:02:20','2023-04-28',1,8,86),(147,'2023-04-28 15:02:30','2023-04-28 17:13:57','2023-04-28',1,8,87),(148,'2023-04-28 17:14:52','2023-04-28 18:10:05','2023-04-28',1,8,88),(149,'2023-05-08 13:22:40','2023-05-08 14:10:06','2023-05-08',1,8,89),(150,'2023-05-08 14:10:08','2023-05-08 16:01:49','2023-05-08',1,8,90),(151,'2023-05-08 16:02:16','2023-05-08 16:07:26','2023-05-08',1,8,91),(156,'2023-05-08 16:12:02','2023-05-08 18:37:59','2023-05-08',1,8,96),(157,'2023-05-09 10:33:23','2023-05-09 12:08:01','2023-05-09',1,8,97),(158,'2023-05-09 14:22:41','2023-05-09 22:05:21','2023-05-09',1,8,98),(159,'2023-05-10 09:12:04','2023-05-10 13:16:00','2023-05-10',1,8,99),(163,'2023-05-10 13:20:43','2023-05-10 16:39:58','2023-05-10',1,8,103),(164,'2023-05-10 12:21:24','2023-05-10 16:23:49','2023-05-10',1,22,104),(166,'2023-05-10 10:23:30','2023-05-10 16:23:57','2023-05-10',1,20,106),(167,'2023-05-10 16:40:11','2023-05-10 18:18:27','2023-05-10',1,8,107),(168,'2023-05-12 13:42:32','2023-05-12 19:00:58','2023-05-12',1,8,108),(169,'2023-05-14 15:45:22','2023-05-14 19:22:49','2023-05-14',1,8,109),(170,'2023-05-14 19:43:51','2023-05-14 19:50:56','2023-05-14',1,8,110),(172,'2023-05-30 08:10:15','2023-05-30 13:41:12','2023-05-30',1,8,112),(177,'2023-05-30 13:46:36','2023-05-30 14:00:42','2023-05-30',1,8,117),(209,'2023-05-30 15:15:30','2023-05-30 15:26:42','2023-05-30',1,8,149),(214,'2023-05-30 16:03:07','2023-05-30 17:12:05','2023-05-30',1,8,154),(262,'2023-06-01 10:44:03','2023-06-01 10:44:09','2023-06-01',1,8,202),(263,'2023-06-01 10:50:29','2023-06-01 10:50:39','2023-06-01',1,8,203),(264,'2023-06-01 10:51:52','2023-06-01 10:51:56','2023-06-01',1,8,204),(265,'2023-06-01 10:51:59','2023-06-01 10:59:43','2023-06-01',1,8,205),(266,'2023-06-01 10:59:57','2023-06-01 11:03:26','2023-06-01',1,8,206),(267,'2023-06-01 11:05:30','2023-06-01 11:56:38','2023-06-01',1,8,207),(268,'2023-06-01 11:56:53','2023-06-01 11:57:45','2023-06-01',1,8,208),(269,'2023-06-01 11:58:43','2023-06-01 11:59:14','2023-06-01',1,8,209),(270,'2023-06-01 11:59:25','2023-06-01 11:59:50','2023-06-01',1,8,210),(271,'2023-06-01 12:00:15','2023-06-01 12:00:15','2023-06-01',1,8,211),(272,'2023-06-01 12:00:15','2023-06-01 12:00:24','2023-06-01',1,8,212),(273,'2023-06-01 12:02:22','2023-06-01 12:02:37','2023-06-01',1,8,213),(274,'2023-06-01 12:02:45','2023-06-01 12:03:03','2023-06-01',1,8,214),(275,'2023-06-01 12:11:18','2023-06-01 12:14:39','2023-06-01',1,8,215),(276,'2023-06-01 12:17:56','2023-06-01 12:18:04','2023-06-01',1,8,216),(277,'2023-06-01 12:19:50','2023-06-01 12:20:15','2023-06-01',1,8,217),(278,'2023-06-01 12:19:51','2023-06-01 12:19:56','2023-06-01',1,8,218),(279,'2023-06-01 12:21:09','2023-06-01 12:21:15','2023-06-01',1,8,219),(280,'2023-06-01 12:21:28','2023-06-01 12:21:33','2023-06-01',1,8,220),(281,'2023-06-01 12:21:38','2023-06-01 12:21:43','2023-06-01',1,8,221),(282,'2023-06-01 12:23:33','2023-06-01 12:23:38','2023-06-01',1,8,222),(283,'2023-06-01 12:27:42','2023-06-01 12:27:48','2023-06-01',1,8,223),(284,'2023-06-01 12:27:52','2023-06-01 12:29:29','2023-06-01',1,8,224),(285,'2023-06-01 12:29:48','2023-06-01 12:30:08','2023-06-01',1,8,225),(286,'2023-06-01 12:52:36','2023-06-01 12:52:41','2023-06-01',1,8,226),(287,'2023-06-01 12:52:44','2023-06-01 12:52:49','2023-06-01',1,8,227),(288,'2023-06-01 13:00:41','2023-06-01 13:01:18','2023-06-01',1,8,228),(289,'2023-06-01 13:02:05','2023-06-01 13:02:38','2023-06-01',1,8,229),(290,'2023-06-01 13:02:31','2023-06-01 13:03:22','2023-06-01',1,20,230),(291,'2023-06-01 13:02:31','2023-06-01 13:02:42','2023-06-01',1,20,231),(292,'2023-06-01 13:03:39','2023-06-01 13:03:43','2023-06-01',1,8,232),(293,'2023-06-01 13:03:47','2023-06-01 13:04:02','2023-06-01',1,20,233),(294,'2023-06-01 13:03:53','2023-06-01 13:03:59','2023-06-01',1,8,234),(295,'2023-06-01 13:15:15','2023-06-01 13:15:21','2023-06-01',1,20,235),(296,'2023-06-01 13:15:16','2023-06-01 13:15:23','2023-06-01',1,8,236),(297,'2023-06-01 13:15:42','2023-06-01 13:15:56','2023-06-01',1,8,237),(298,'2023-06-01 13:15:50','2023-06-01 13:16:00','2023-06-01',1,20,238),(299,'2023-06-01 13:19:57','2023-06-01 13:20:35','2023-06-01',1,20,239),(300,'2023-06-01 13:20:05','2023-06-01 13:20:39','2023-06-01',1,8,240),(301,'2023-06-01 13:53:49','2023-06-01 13:53:58','2023-06-01',1,8,241),(302,'2023-06-01 13:54:03','2023-06-01 13:54:24','2023-06-01',1,8,242),(303,'2023-06-01 13:54:20','2023-06-01 13:54:27','2023-06-01',1,20,243),(304,'2023-06-01 13:54:31','2023-06-01 13:54:36','2023-06-01',1,20,244),(305,'2023-06-01 13:54:38','2023-06-01 13:54:45','2023-06-01',1,8,245),(306,'2023-06-01 13:59:15','2023-06-01 13:59:41','2023-06-01',1,8,246),(307,'2023-06-01 14:08:57','2023-06-01 14:09:08','2023-06-01',1,8,247),(308,'2023-06-08 17:37:45','2023-06-08 17:37:57','2023-06-08',1,8,248),(309,'2023-06-08 17:38:06','2023-06-08 17:38:25','2023-06-08',1,8,249),(310,'2023-06-08 17:38:40','2023-06-09 17:59:06','2023-06-08',1,8,250),(311,'2023-10-23 08:45:50','2023-10-23 08:46:09','2023-10-23',1,8,251),(312,'2023-10-23 08:46:56','2023-10-23 08:47:11','2023-10-23',1,8,252),(313,'2023-10-23 08:48:30','2023-10-23 16:00:34','2023-10-23',1,8,253),(314,'2023-10-24 09:10:34','2023-10-24 18:00:36','2023-10-24',1,22,254),(332,'2023-10-25 07:00:00','2023-10-25 13:40:24','2023-10-25',1,8,272),(338,'2023-10-25 13:49:05','2023-10-25 13:52:42','2023-10-25',1,8,278),(339,'2023-10-25 13:52:57','2023-10-25 14:02:47','2023-10-25',1,8,279),(340,'2023-10-25 14:02:50','2023-10-25 14:25:57','2023-10-25',1,8,280),(341,'2023-10-25 14:26:08','2023-10-25 15:00:12','2023-10-25',1,8,281),(342,'2023-10-27 09:00:19','2023-10-27 18:44:23','2023-10-27',1,22,282),(343,'2023-10-30 09:09:13','2023-10-30 16:18:45','2023-10-30',1,22,283),(344,'2023-11-20 16:16:36','2023-11-20 19:00:47','2023-11-20',1,20,284),(346,'2023-11-20 16:19:22','2023-11-20 19:02:24','2023-11-20',1,22,286),(347,'2024-02-07 11:18:09','2024-02-07 14:49:24','2024-02-07',1,8,287),(348,'2024-02-07 14:49:26','2024-02-07 20:00:58','2024-02-07',1,8,288),(349,'2024-02-08 10:56:02','2024-02-08 10:56:24','2024-02-08',1,8,289),(350,'2024-02-08 10:56:29','2024-02-08 18:25:11','2024-02-08',1,8,290),(351,'2024-02-08 10:59:43','2024-02-09 00:13:15','2024-02-08',1,22,291),(355,'2024-02-09 16:05:31','2024-02-09 16:08:38','2024-02-09',1,8,295),(356,'2024-02-09 10:05:56','2024-02-09 16:31:28','2024-02-09',1,22,296),(359,'2024-02-09 09:40:05','2024-02-09 16:40:06','2024-02-09',1,20,299),(360,'2024-02-09 18:49:14','2024-02-09 18:49:34','2024-02-09',1,22,300),(361,'2024-02-09 18:50:00','2024-02-09 19:00:08','2024-02-09',1,22,301),(362,'2024-02-14 14:00:56','2024-02-14 15:10:43','2024-02-14',1,20,302),(363,'2024-02-14 16:57:49','2024-02-14 20:57:55','2024-02-14',1,20,303),(364,'2024-02-14 14:00:11','2024-02-14 22:00:11','2024-02-14',1,55,304),(365,'2024-02-14 18:00:03','2024-02-15 03:00:06','2024-02-14',1,22,305),(368,'2024-02-15 16:14:14','2024-02-15 18:14:04','2024-02-15',1,20,308),(369,'2024-02-15 17:56:50','2024-02-15 18:56:35','2024-02-15',1,55,309),(370,'2024-02-15 14:30:46','2024-02-15 18:31:44','2024-02-15',1,55,310),(373,'2024-02-15 18:37:45','2024-02-15 18:38:07','2024-02-15',1,20,313),(387,'2024-02-15 19:50:17','2024-02-15 19:52:23','2024-02-15',1,55,327),(401,'2024-02-15 20:21:58','2024-02-15 20:24:13','2024-02-15',1,55,341),(402,'2024-02-15 20:24:23','2024-02-15 23:08:12','2024-02-15',1,55,342),(416,'2024-02-16 21:09:45','2024-02-16 21:17:21','2024-02-16',1,55,356),(418,'2024-02-16 21:18:04','2024-02-16 21:57:30','2024-02-16',1,55,358),(419,'2024-02-19 20:51:36','2024-02-19 22:28:59','2024-02-19',1,56,359),(420,'2024-02-19 21:01:12','2024-02-19 22:35:12','2024-02-19',1,58,360),(421,'2024-02-19 21:01:26','2024-02-19 22:55:02','2024-02-19',1,57,361),(422,'2024-02-19 21:02:16','2024-02-20 01:33:54','2024-02-19',1,20,362),(423,'2024-02-19 20:37:42','2024-02-19 23:02:42','2024-02-19',1,33,363),(424,'2024-02-19 21:30:04','2024-02-19 21:45:25','2024-02-19',1,55,364),(425,'2024-02-19 21:36:55','2024-02-19 22:35:03','2024-02-19',1,60,365),(430,'2024-02-19 21:46:11','2024-02-19 21:50:50','2024-02-19',1,55,370),(435,'2024-02-19 21:51:21','2024-02-19 22:57:23','2024-02-19',1,55,375),(439,'2024-02-20 01:03:19','2024-02-20 01:04:06','2024-02-20',1,55,379),(440,'2024-02-20 13:01:47','2024-02-20 13:32:35','2024-02-20',1,55,380),(441,'2024-02-20 13:32:37','2024-02-20 22:32:40','2024-02-20',1,55,381),(442,'2024-02-20 14:00:02','2024-02-20 23:00:06','2024-02-20',1,56,382),(443,'2024-02-20 14:00:09','2024-02-20 23:01:34','2024-02-20',1,37,383),(444,'2024-02-20 14:01:19','2024-02-20 17:23:18','2024-02-20',1,60,384),(445,'2024-02-20 14:01:37','2024-02-20 23:02:07','2024-02-20',1,33,385),(446,'2024-02-20 14:14:17','2024-02-20 21:04:22','2024-02-20',1,58,386),(447,'2024-02-20 14:42:31','2024-02-20 23:01:55','2024-02-20',1,57,387),(448,'2024-02-20 14:51:16','2024-02-20 16:07:28','2024-02-20',1,59,388),(449,'2024-02-20 16:07:51','2024-02-20 21:59:21','2024-02-20',1,59,389),(450,'2024-02-20 18:20:13','2024-02-20 23:02:23','2024-02-20',1,60,390),(451,'2024-02-20 18:31:16','2024-02-21 02:15:04','2024-02-20',1,20,391),(452,'2024-02-21 13:23:21','2024-02-21 22:00:02','2024-02-21',1,59,392),(453,'2024-02-21 13:49:12','2024-02-21 23:04:31','2024-02-21',1,55,393),(454,'2024-02-21 13:55:19','2024-02-21 23:01:38','2024-02-21',1,33,394),(455,'2024-02-21 13:59:31','2024-02-21 23:00:27','2024-02-21',1,37,395),(456,'2024-02-21 14:00:00','2024-02-21 23:00:12','2024-02-21',1,56,396),(457,'2024-02-21 14:00:44','2024-02-21 17:42:31','2024-02-21',1,60,397),(458,'2024-02-21 14:13:48','2024-02-21 23:00:15','2024-02-21',1,57,398),(459,'2024-02-21 18:10:00','2024-02-22 02:05:08','2024-02-21',1,20,399),(460,'2024-02-21 18:42:42','2024-02-21 23:01:45','2024-02-21',1,60,400),(461,'2024-02-22 13:03:43','2024-02-22 13:31:51','2024-02-22',1,55,401),(462,'2024-02-22 13:14:57','2024-02-23 12:58:04','2024-02-22',1,59,402),(463,'2024-02-22 13:31:52','2024-02-22 22:55:09','2024-02-22',1,55,403),(464,'2024-02-22 14:00:09','2024-02-22 23:02:37','2024-02-22',1,56,404),(465,'2024-02-22 14:00:11','2024-02-22 23:00:34','2024-02-22',1,37,405),(466,'2024-02-22 14:01:31','2024-02-22 17:08:15','2024-02-22',1,60,406),(467,'2024-02-22 14:03:00','2024-02-22 23:05:02','2024-02-22',1,58,407),(468,'2024-02-22 14:04:53','2024-02-22 23:07:02','2024-02-22',1,33,408),(469,'2024-02-22 14:12:01','2024-02-22 23:05:14','2024-02-22',1,57,409),(470,'2024-02-22 17:00:36','2024-02-23 01:08:36','2024-02-22',1,20,410),(471,'2024-02-22 18:07:50','2024-02-22 23:00:29','2024-02-22',1,60,411),(472,'2024-02-23 12:59:34','2024-02-23 21:59:34','2024-02-23',1,59,412),(473,'2024-02-23 13:22:19','2024-02-23 23:17:51','2024-02-23',1,55,413),(474,'2024-02-23 13:59:15','2024-02-23 23:00:04','2024-02-23',1,37,414),(475,'2024-02-23 14:02:40','2024-02-23 17:19:55','2024-02-23',1,60,415),(476,'2024-02-23 14:08:37','2024-02-23 23:00:09','2024-02-23',1,33,416),(477,'2024-02-23 14:14:41','2024-02-23 22:54:05','2024-02-23',1,58,417),(478,'2024-02-23 16:05:17','2024-02-23 23:00:27','2024-02-23',1,57,418),(479,'2024-02-23 16:08:21','2024-02-23 16:08:22','2024-02-23',1,20,419),(480,'2024-02-23 17:00:18','2024-02-24 01:50:14','2024-02-23',1,20,420),(481,'2024-02-23 18:12:18','2024-02-23 23:00:31','2024-02-23',1,56,421),(482,'2024-02-23 18:21:14','2024-02-23 23:00:51','2024-02-23',1,60,422),(483,'2024-02-27 21:58:12','2024-02-27 21:58:12','2024-02-27',1,55,423),(484,'2024-02-27 13:09:59','2024-02-27 23:20:59','2024-02-27',1,55,424),(488,'2024-03-03 14:00:45','2024-03-04 00:50:45','2024-03-03',1,55,428),(489,'2024-03-03 04:15:57','2024-03-03 06:20:57','2024-03-03',1,55,429),(490,'2024-03-05 19:30:16','2024-03-06 16:27:06','2024-03-05',1,55,430),(491,'2024-03-06 16:27:07','2024-03-06 22:35:57','2024-03-06',1,55,431),(492,'2024-03-07 17:04:32','2024-03-07 17:08:24','2024-03-07',1,55,432),(494,'2024-03-07 17:08:34','2024-03-07 17:08:34','2024-03-07',0,55,434);
/*!40000 ALTER TABLE `entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `currency_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `status_id` (`status_id`),
  KEY `currency_id` (`currency_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,'monthly payment',1999.99,34,1,1,'2023-10-16 15:55:07','2023-10-23 09:23:19'),(2,'pending test payment',1599,34,2,1,'2023-10-16 15:57:31','2023-10-23 09:52:39'),(3,'monthly payments\r\n',2500,34,2,1,'2023-10-23 18:14:42','2023-10-23 18:14:42'),(4,'monthly payments\r\n',2502,34,1,1,'2023-10-23 18:14:42','2023-10-23 09:20:41'),(5,'february payment',2599.99,34,2,1,'2024-01-23 18:14:42','2024-01-23 18:14:42');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin'),(2,'Employee'),(3,'Employer');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status`
--

LOCK TABLES `status` WRITE;
/*!40000 ALTER TABLE `status` DISABLE KEYS */;
INSERT INTO `status` VALUES (1,'Active'),(2,'Pending');
/*!40000 ALTER TABLE `status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=435 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,'brief description'),(2,'tests de tasks'),(3,'new description'),(4,'different'),(5,'new one '),(6,'developing2'),(7,'new description'),(8,''),(9,'alborada developing'),(10,'alborada developing'),(11,'alborada developing'),(12,'alborada developing'),(13,''),(14,''),(15,''),(16,''),(17,''),(18,''),(19,''),(20,''),(21,''),(22,''),(23,''),(24,''),(25,'tests de tasks 1'),(26,''),(27,''),(28,'test'),(29,''),(30,''),(31,''),(32,'reports section'),(33,'inimble app '),(34,'i-nimble app '),(35,''),(36,''),(37,'trying same day entries'),(38,'i-nimble reports dashboard'),(39,'continuing i-nimble reports dashboard'),(40,'lunch break'),(41,'starting'),(42,'chartjs'),(43,'lunch '),(44,'chartjs'),(45,'finishing reports section'),(46,'starting admin Module'),(47,'lunch time'),(48,'admin Module'),(49,'dashboard admin Module'),(50,'first try '),(51,''),(52,'lunch break'),(53,'excel Reports fix'),(54,'searcher'),(55,'test'),(56,'admin dashboard search and user entries modifications'),(57,'second user entries test'),(58,'stop / admin edited'),(59,'lunch break admin edited'),(60,'admin users entries'),(61,'review'),(62,'testing'),(63,''),(64,'more testing entries'),(65,''),(66,''),(67,''),(68,''),(69,''),(70,'testing timekeeper'),(71,'timer tests'),(72,''),(73,''),(74,''),(75,''),(76,''),(77,''),(78,''),(79,''),(80,''),(81,''),(82,'timer test'),(83,''),(84,''),(85,''),(86,''),(87,''),(88,''),(89,''),(90,''),(91,''),(92,''),(93,''),(94,''),(95,''),(96,''),(97,''),(98,''),(99,'optimizing'),(100,''),(101,''),(102,''),(103,''),(104,'testing multiple logs'),(105,'Testing multiple logs'),(106,'More Logs'),(107,''),(108,''),(109,''),(110,''),(111,''),(112,''),(113,''),(114,''),(115,''),(116,''),(117,''),(118,''),(119,''),(120,''),(121,''),(122,''),(123,''),(124,''),(125,''),(126,''),(127,''),(128,''),(129,''),(130,''),(131,''),(132,''),(133,''),(134,''),(135,''),(136,''),(137,''),(138,''),(139,'testing'),(140,''),(141,''),(142,''),(143,''),(144,''),(145,''),(146,''),(147,''),(148,''),(149,'void name editado'),(150,'void task'),(151,''),(152,'void task'),(153,''),(154,''),(155,''),(156,''),(157,''),(158,''),(159,''),(160,''),(161,''),(162,''),(163,''),(164,''),(165,''),(166,''),(167,''),(168,''),(169,''),(170,''),(171,''),(172,''),(173,''),(174,''),(175,''),(176,''),(177,''),(178,''),(179,''),(180,''),(181,''),(182,''),(183,''),(184,''),(185,''),(186,''),(187,''),(188,''),(189,''),(190,''),(191,''),(192,''),(193,''),(194,''),(195,''),(196,''),(197,''),(198,''),(199,''),(200,''),(201,''),(202,''),(203,''),(204,''),(205,''),(206,''),(207,''),(208,''),(209,''),(210,''),(211,''),(212,''),(213,''),(214,''),(215,''),(216,''),(217,''),(218,''),(219,''),(220,''),(221,''),(222,''),(223,''),(224,''),(225,''),(226,''),(227,''),(228,''),(229,''),(230,''),(231,''),(232,''),(233,''),(234,''),(235,''),(236,''),(237,''),(238,''),(239,''),(240,''),(241,''),(242,''),(243,''),(244,''),(245,''),(246,''),(247,''),(248,''),(249,''),(250,''),(251,''),(252,''),(253,''),(254,''),(255,''),(256,''),(257,''),(258,''),(259,''),(260,''),(261,''),(262,''),(263,''),(264,''),(265,''),(266,''),(267,''),(268,''),(269,''),(270,''),(271,''),(272,''),(273,''),(274,''),(275,''),(276,''),(277,''),(278,''),(279,''),(280,''),(281,'salir por una emergencia medica'),(282,''),(283,''),(284,''),(285,''),(286,''),(287,''),(288,''),(289,''),(290,''),(291,''),(292,''),(293,''),(294,''),(295,''),(296,''),(297,''),(298,''),(299,''),(300,''),(301,''),(302,''),(303,'sali temprano este dia '),(304,'Comment added'),(305,''),(306,''),(307,''),(308,''),(309,''),(310,''),(311,''),(312,''),(313,''),(314,''),(315,''),(316,''),(317,''),(318,''),(319,''),(320,''),(321,''),(322,''),(323,''),(324,''),(325,''),(326,''),(327,''),(328,''),(329,''),(330,''),(331,''),(332,''),(333,''),(334,''),(335,''),(336,''),(337,''),(338,''),(339,''),(340,''),(341,''),(342,''),(343,''),(344,''),(345,''),(346,''),(347,''),(348,''),(349,''),(350,''),(351,''),(352,''),(353,''),(354,''),(355,''),(356,''),(357,''),(358,''),(359,''),(360,'Historia de Yago, historia de hiring, Post hiring de mañana, Carrusel de la actividad del sábado, carrusel para la cuenta de ig de Andrés, carrusel de mañana.'),(361,''),(362,'First day done'),(363,''),(364,''),(365,''),(366,''),(367,''),(368,''),(369,''),(370,''),(371,''),(372,''),(373,''),(374,''),(375,''),(376,''),(377,''),(378,''),(379,''),(380,'fixes in inimble timer app for delete entries in admin module and confirmation modal added to delete both users and entries'),(381,''),(382,''),(383,''),(384,'Sales Development Representative'),(385,''),(386,''),(387,''),(388,'Email Marketing - Email 1'),(389,'Inimble - Content creation'),(390,'Sales Development Representative '),(391,'Inicio tardío (my bad)'),(392,''),(393,''),(394,''),(395,''),(396,''),(397,'Sales Development Representative'),(398,''),(399,''),(400,'Sales Development Representative'),(401,'inimble app: some logic fixes in entries end_time update function'),(402,''),(403,''),(404,''),(405,''),(406,'Sales Development Representative'),(407,''),(408,''),(409,''),(410,'Hoy si a tiempo'),(411,'Sales Development Representative'),(412,''),(413,''),(414,''),(415,'Sales Development Representatove'),(416,''),(417,''),(418,''),(419,''),(420,''),(421,''),(422,'Sales Development Representative'),(423,'edited task from a different component'),(424,''),(425,''),(426,''),(427,''),(428,''),(429,'some logic fixes in entries end_time update function edited'),(430,''),(431,''),(432,''),(433,''),(434,'');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `time_tracker`
--

DROP TABLE IF EXISTS `time_tracker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `time_tracker` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `task_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `time_tracker_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `time_tracker_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `time_tracker`
--

LOCK TABLES `time_tracker` WRITE;
/*!40000 ALTER TABLE `time_tracker` DISABLE KEYS */;
/*!40000 ALTER TABLE `time_tracker` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (27,1,1),(31,8,1),(32,19,1),(33,20,2),(35,22,2),(42,33,2),(43,34,3),(46,37,2),(48,40,3),(63,55,2),(64,56,2),(65,57,2),(66,58,2),(67,59,2),(68,60,2);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `last_active` timestamp NULL DEFAULT NULL,
  `active` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Info','Inimble','info@i-nimble.com','$2a$10$2AFpzfEqSvv8WhHvwxcsHeOKAYgxkVQEFfToQDpO6kzsQ0fk5wDUq','2024-02-15 15:39:28',0),(8,'Carlos','Rivas','crivas@i-nimble.com','$2a$10$2AFpzfEqSvv8WhHvwxcsHeOKAYgxkVQEFfToQDpO6kzsQ0fk5wDUq','2024-03-06 19:04:42',1),(19,'Rubena','Díaz','rdiaz@i-nimble.com','$2a$10$yr7QAKuRQJf3mcq85ya4ZeqmZpmJ2BNS06Btf5RwozoIZRnG.uVG2','2024-02-25 22:00:56',0),(20,'Gabriel','Huerta','ghuerta@i-nimble.com','$2a$10$3BWRWkxAqQovGwKnGAz6UO3/ZaH.hSy1HrCyk5DA3hHkvRg8oJAMe','2024-02-23 17:02:13',1),(22,'Dayanny','Sánchez','dsanchez@i-nimble.com','$2a$10$wFO6TY.uYeHdhui.KKy/X.z7y9MOzlxMhAwVLTLZxxfINK5ozSQOO','2024-02-14 21:57:58',0),(33,'Victoria','Bohorquez','marketing@i-nimble.com','$2a$10$5NOYvWWjf.FlhmHYJXTCUuLHHUnO.axfZku7eXLhBJ9I/f4OpAVae','2024-02-23 14:08:35',1),(34,'Andres','Palma','apalma@i-nimble.com','$2a$10$Bbb3m48qCsUT5DlUO1BYLeyiAHit1uk.avhoKi8ky./XIi9px5zFi','2024-03-07 16:54:51',1),(37,'Naisireth','Peña','npena@i-nimble.com','$2a$10$ThQcqFHSZ.6y1BD4AsShgex/WAiayt1MUzzdanMVowBNVvtqQ9g3K','2024-02-23 13:52:42',1),(40,'Testing','User','test@i-nimble.com','$2a$10$6XJxoTcV7rrKi7A2g2A9sOuXCJy7cKKEXn87NSujKbr1iLFrc7/ZC','2024-02-12 13:58:41',0),(55,'Carlos','Rivas','delete@i-nimble.com','$2a$10$Is2XMZ64QFeWbBuUqpwFkeSXboTlST7xCWUENZrvHM71a2g5rakNW','2024-03-07 16:55:45',1),(56,'Paola','García','pgarcia@i-nimble.com','$2a$10$X1YoTqQUNA170OwTmC1L7eFvuiggib2xK0p2s0en7iJOO.0ZkKV7W','2024-02-23 18:12:17',1),(57,'Francis','Sánchez','design.jr@i-nimble.com','$2a$10$cXYs3O.xXA6jQ7D9DdGaE.2dPRGrHeMzJQ75X34B8.yQEtAgAKE3O','2024-02-23 16:05:16',1),(58,'Valeria ','Durán','design@i-nimble.com','$2a$10$bYgdMH4lGpTY5ulZkQS/2eYv.lup372yPHET0/i6HLS7j/.WGxhZ6','2024-02-23 14:14:33',1),(59,'Alexander','Quintero','cm_marketing@i-nimble.com','$2a$10$maO7mh2zE9lPzZkAhfp5detBvPoDsl44/k4w5bI9gqwXqTmbrbYkW','2024-02-23 12:57:55',1),(60,'Carlos ','González','SDR1@i-nimble.com','$2a$10$1u.HaJ0SSvnU2xiaPJZ5sO5OjpZNNPCazUcDyKm22a0kYgdQfwOVS','2024-02-23 16:50:42',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-07 13:24:36
