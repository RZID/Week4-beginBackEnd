-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 10, 2021 at 09:05 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_pos`
--
CREATE DATABASE IF NOT EXISTS `db_pos` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `db_pos`;

-- --------------------------------------------------------

--
-- Table structure for table `tb_category`
--

CREATE TABLE `tb_category` (
  `id_category` int(11) NOT NULL,
  `name_category` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_category`
--

INSERT INTO `tb_category` (`id_category`, `name_category`) VALUES
(1, 'Drinks'),
(2, 'Foods');

-- --------------------------------------------------------

--
-- Table structure for table `tb_history`
--

CREATE TABLE `tb_history` (
  `id_history` int(11) NOT NULL,
  `date_history` datetime NOT NULL DEFAULT current_timestamp(),
  `cashier_history` varchar(255) NOT NULL,
  `product_history` text NOT NULL,
  `amount_history` bigint(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_history`
--

INSERT INTO `tb_history` (`id_history`, `date_history`, `cashier_history`, `product_history`, `amount_history`) VALUES
(1, '2021-01-10 14:48:35', 'Cashier 1', 'Espresso x1, Coffee Latte x3, Cappucino x2', 65000),
(2, '2021-01-10 14:51:33', 'Pevita Pearce', 'Espresso x5, Cappucino x4', 70000);

-- --------------------------------------------------------

--
-- Table structure for table `tb_product`
--

CREATE TABLE `tb_product` (
  `id_product` int(11) NOT NULL,
  `name_product` varchar(255) NOT NULL,
  `price_product` int(100) NOT NULL,
  `category_product` int(10) NOT NULL,
  `image_product` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_product`
--

INSERT INTO `tb_product` (`id_product`, `name_product`, `price_product`, `category_product`, `image_product`) VALUES
(1, 'Espresso', 10000, 1, 'espresso.jpg'),
(2, 'Coffee Latte', 15000, 1, 'latte.jpg'),
(3, 'Cappucino', 5000, 1, 'cappucino.jpg'),
(4, 'Red Velvet Latte', 33000, 1, 'velvet.jpg'),
(5, 'Choco Rhum', 28000, 2, 'choco_rhum.jpg'),
(6, 'Black Forest', 30000, 2, 'black_forest.jpg'),
(7, 'Chicken Katsu Dabu-dabu', 60000, 2, 'katsu.jpg'),
(8, 'Salmon Truffle Teriyaki', 60000, 2, 'truffle_teriyaki.jpg'),
(9, 'Wiener Schnitzel', 69000, 2, 'wiener.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_category`
--
ALTER TABLE `tb_category`
  ADD PRIMARY KEY (`id_category`) USING BTREE;

--
-- Indexes for table `tb_history`
--
ALTER TABLE `tb_history`
  ADD PRIMARY KEY (`id_history`);

--
-- Indexes for table `tb_product`
--
ALTER TABLE `tb_product`
  ADD PRIMARY KEY (`id_product`),
  ADD KEY `category_product` (`category_product`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_category`
--
ALTER TABLE `tb_category`
  MODIFY `id_category` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tb_history`
--
ALTER TABLE `tb_history`
  MODIFY `id_history` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tb_product`
--
ALTER TABLE `tb_product`
  MODIFY `id_product` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_product`
--
ALTER TABLE `tb_product`
  ADD CONSTRAINT `Category` FOREIGN KEY (`category_product`) REFERENCES `tb_category` (`id_category`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
