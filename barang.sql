-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: sql.freedb.tech
-- Waktu pembuatan: 02 Feb 2025 pada 05.56
-- Versi server: 8.0.41-0ubuntu0.22.04.1
-- Versi PHP: 8.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `freedb_swating`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `barang`
--

CREATE TABLE `barang` (
  `id` int NOT NULL,
  `namaBarang` varchar(255) NOT NULL,
  `kategoriBarang` varchar(30) NOT NULL,
  `kodeProduk` varchar(50) NOT NULL,
  `hargaAwal` int DEFAULT NULL,
  `hargaJual` int NOT NULL,
  `stock` int DEFAULT NULL,
  `penitipId` int DEFAULT NULL,
  `created_at` date NOT NULL,
  `updated_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `barang`
--

INSERT INTO `barang` (`id`, `namaBarang`, `kategoriBarang`, `kodeProduk`, `hargaAwal`, `hargaJual`, `stock`, `penitipId`, `created_at`, `updated_at`) VALUES
(1, 'Topi Hitam', 'Aksesoris', 'TH-5014-IPN', 13000, 20000, 18, 1, '2025-01-03', '2025-01-09'),
(2, 'Masker Ninja', 'Aksesoris', 'MN-4461-IPN', 8000, 15000, 11, 1, '2025-01-03', '2025-01-03'),
(3, 'Manset', 'Aksesoris', 'M-6915-IPN', 8000, 15000, 12, 1, '2025-01-03', '2025-01-03'),
(4, 'Kaos Kaki Cewe Import', 'Aksesoris', 'KKCI-9306-IPN', 9000, 15000, 10, 1, '2025-01-03', '2025-01-03'),
(5, 'Topi Dieng Dewasa', 'Aksesoris', 'TDD-2567-IPN', 17000, 25000, 8, 1, '2025-01-03', '2025-01-17'),
(6, 'Topi Dieng Anak', 'Aksesoris', 'TDA-9022-IPN', 16000, 25000, 8, 1, '2025-01-03', '2025-01-03'),
(7, 'Mantol Atasan', 'Aksesoris', 'MA-9669-IPN', 7000, 10000, 7, 1, '2025-01-03', '2025-01-08'),
(8, 'Mantol Stelan', 'Aksesoris', 'MS-7717-IPN', 9000, 15000, 0, 1, '2025-01-03', '2025-01-12'),
(9, 'Klotak Sedang', 'Oleh-oleh', 'KS-7307-ANT', 10000, 13000, 21, 2, '2025-01-03', '2025-01-08'),
(10, 'Klotak Kecil', 'Oleh-oleh', 'KK-4862-NUR', 7000, 10000, 6, 3, '2025-01-03', '2025-01-08'),
(11, 'Klotak Besar', 'Oleh-oleh', 'KB-2715-NUR', 12000, 15000, 3, 3, '2025-01-03', '2025-01-08'),
(12, 'Klotak Atos', 'Oleh-oleh', 'KA-4125-NUR', 6500, 10000, 7, 3, '2025-01-03', '2025-01-08'),
(13, 'Kopi Tentrem', 'Oleh-oleh', 'KT-7563-AAN', 25000, 30000, 14, 4, '2025-01-03', '2025-01-15'),
(17, 'Syal', 'Aksesoris', 'S-7890-IPN', 17000, 25000, 10, 1, '2025-01-03', '2025-01-03'),
(18, 'Lemon Water', 'Minuman', 'LW-8655-SWT', 6750, 8000, 21, 6, '2025-01-03', '2025-01-16'),
(19, 'You C Lemon', 'Minuman', 'YCL-3641-SWT', 5700, 7000, 28, 6, '2025-01-03', '2025-01-07'),
(20, 'Pocari Besar', 'Minuman', 'PB-2310-SWT', 6250, 8000, 8, 6, '2025-01-03', '2025-01-12'),
(21, 'Pocari Kecil', 'Minuman', 'PK-6837-SWT', 5250, 6000, 9, 6, '2025-01-03', '2025-01-10'),
(22, 'Krating Daeng', 'Minuman', 'KD-9831-SWT', 5100, 7000, 8, 6, '2025-01-03', '2025-01-07'),
(23, 'Mizone', 'Minuman', 'M-9235-SWT', 3986, 5000, 7, 6, '2025-01-03', '2025-01-06'),
(24, 'Coca-cola', 'Minuman', 'C-6603-SWT', 2750, 4000, 12, 6, '2025-01-03', '2025-01-03'),
(25, 'Sprite Kecil ', 'Minuman', 'SK-5705-SWT', 2725, 4000, 11, 6, '2025-01-03', '2025-01-03'),
(26, 'Sprite Besar ', 'Minuman', 'SB-3567-SWT', 4000, 5000, 10, 6, '2025-01-03', '2025-01-06'),
(27, 'Coca-cola Besar ', 'Minuman', 'CB-5767-SWT', 4000, 5000, 12, 6, '2025-01-03', '2025-01-03'),
(28, 'Fanta ', 'Minuman', 'F-9773-SWT', 3917, 5000, 12, 6, '2025-01-03', '2025-01-03'),
(29, 'Abc Kopi Susu', 'Minuman', 'AKS-9113-SWT', 3021, 4000, 21, 6, '2025-01-03', '2025-01-12'),
(30, 'Floridina', 'Minuman', 'F-4000-SWT', 3300, 5000, 11, 6, '2025-01-03', '2025-01-13'),
(31, 'Minute Maid Pulpy', 'Minuman', 'MMP-8570-SWT', 5500, 6000, 7, 6, '2025-01-03', '2025-01-16'),
(32, 'Aqua Sedang', 'Minuman', 'AS-7453-SWT', 1980, 4000, 21, 6, '2025-01-03', '2025-01-17'),
(33, 'Ades Sedang', 'Minuman', 'AS-4071-SWT', 2550, 4000, 21, 6, '2025-01-03', '2025-01-17'),
(34, 'Le Minerale Sedang', 'Minuman', 'LMS-1251-SWT', 2083, 4000, 8, 6, '2025-01-03', '2025-01-06'),
(35, 'Le Minerale Besar', 'Minuman', 'LMB-1144-SWT', 4583, 6000, 9, 6, '2025-01-03', '2025-01-17'),
(36, 'Milku', 'Minuman', 'M-5768-SWT', 3000, 4000, 7, 6, '2025-01-03', '2025-01-07'),
(37, 'Teh Kotak', 'Minuman', 'TK-3478-SWT', 3187, 5000, 20, 6, '2025-01-03', '2025-01-17'),
(38, 'Fruit Tea', 'Minuman', 'FT-2981-SWT', 1833, 5000, 24, 6, '2025-01-03', '2025-01-03'),
(39, 'Teh Pucuk', 'Minuman', 'TP-5724-SWT', 2583, 4000, 5, 6, '2025-01-03', '2025-01-07'),
(40, 'Nu Green Tea Besar', 'Minuman', 'NGTB-3007', 5150, 7000, 9, NULL, '2025-01-03', '2025-01-03'),
(41, 'Nu Green Tea Kecil ', 'Minuman', 'NGTK-5083-SWT', 4500, 5000, 5, 6, '2025-01-03', '2025-01-10'),
(42, 'Teh Botol ', 'Minuman', 'TB-3443-SWT', 3667, 5000, 11, 6, '2025-01-03', '2025-01-03'),
(43, 'Tebs', 'Minuman', 'T-8757-SWT', 6300, 8000, 3, 6, '2025-01-03', '2025-01-03'),
(44, 'Lasegar', 'Minuman', 'L-7396-SWT', 6000, 7000, 5, 6, '2025-01-03', '2025-01-03'),
(45, 'Larutan Cap Kaki Tiga ', 'Minuman', 'LCKT-6541-SWT', 5500, 7000, 4, 6, '2025-01-03', '2025-01-03'),
(46, 'Makaroni Rujak ', 'Oleh-oleh', 'MR-9977-SWT', 6500, 8000, 0, 6, '2025-01-03', '2025-01-08'),
(47, 'Potato ', 'Oleh-oleh', 'P-7584-SWT', 8000, 10000, 0, 6, '2025-01-03', '2025-01-08'),
(48, 'Lanting', 'Oleh-oleh', 'L-2061-SWT', 10000, 12000, 0, 6, '2025-01-03', '2025-01-08'),
(49, 'Telur Ikan Pedas ', 'Oleh-oleh', 'TIP-1195-SWT', 9500, 12000, 1, 6, '2025-01-03', '2025-01-08'),
(50, 'Kacang Garing Dua Kelinci ', 'Oleh-oleh', 'KGDK-4402-SWT', 10500, 12000, 5, 6, '2025-01-03', '2025-01-03'),
(52, 'Monde Snack Gold', 'Oleh-oleh', 'MSG-5588-SWT', 4000, 6000, 1, 6, '2025-01-03', '2025-01-07'),
(53, 'Monde Snack Spicy Tomato ', 'Oleh-oleh', 'MSST-7033-SWT', 4750, 6000, 1, 6, '2025-01-03', '2025-01-07'),
(54, 'Roma Kelapa Cream Cokelat ', 'Oleh-oleh', 'RKCC-1717-SWT', 9250, 11000, 3, 6, '2025-01-03', '2025-01-08'),
(55, 'Roma Malkist', 'Oleh-oleh', 'RM-4417-SWT', 6500, 8000, 1, 6, '2025-01-03', '2025-01-17'),
(56, 'Roma Sari Gandum ', 'Oleh-oleh', 'RSG-6921-SWT', 4833, 9000, 9, 6, '2025-01-03', '2025-01-03'),
(57, 'Crispy Crackers ', 'Oleh-oleh', 'CC-9376-SWT', 9750, 11000, 3, 6, '2025-01-03', '2025-01-08'),
(58, 'Vegetable Crackers ', 'Oleh-oleh', 'VC-9107-SWT', 8500, 10000, 3, 6, '2025-01-03', '2025-01-08'),
(59, 'Malkist Seaweed ', 'Oleh-oleh', 'MS-1526-SWT', 7000, 8000, 3, 6, '2025-01-03', '2025-01-08'),
(60, 'Sandal Swallow ', 'Aksesoris', 'SS-5789-IPN', 11000, 15000, 3, 1, '2025-01-04', '2025-01-04'),
(61, 'Kaos Kaki Tebal ', 'Aksesoris', 'KKT-1278-IPN', 8000, 15000, 7, 1, '2025-01-04', '2025-01-17'),
(62, 'Kaos Kaki Kantor ', 'Aksesoris', 'KKK-8978-IPN', 7000, 10000, 8, 1, '2025-01-04', '2025-01-04'),
(63, 'Kaos Kaki Muslim', 'Aksesoris', 'KKM-8060-IPN', 8500, 15000, 9, 1, '2025-01-04', '2025-01-08'),
(64, 'Kaos Kaki Muslim Batik', 'Aksesoris', 'KKMB-4029-IPN', 9000, 15000, 12, 1, '2025-01-04', '2025-01-04'),
(65, 'Kaos Kaki Anak', 'Aksesoris', 'KKA-8422-IPN', 6000, 10000, 7, 1, '2025-01-04', '2025-01-11'),
(66, 'Baf', 'Aksesoris', 'B-8574-IPN', 10000, 15000, 23, 1, '2025-01-04', '2025-01-04'),
(67, 'Kaos Kaki Jari Warna', 'Aksesoris', 'KKJW-8454-IPN', 6000, 10000, 11, 1, '2025-01-04', '2025-01-04'),
(68, 'Sarung Tangan Bulu', 'Aksesoris', 'STB-3449-IPN', 8000, 15000, 9, 1, '2025-01-04', '2025-01-04'),
(69, 'Sarung Tangan Dieng ', 'Aksesoris', 'STD-7242-IPN', 9000, 20000, 8, 1, '2025-01-04', '2025-01-07'),
(70, 'Sarung Tangan Hitam', 'Aksesoris', 'STH-9486-IPN', 7000, 10000, 6, 1, '2025-01-04', '2025-01-06'),
(71, 'Nutriboost Jeruk', 'Minuman', 'NJ-6548-SWT', 5650, 7000, 10, 6, '2025-01-04', '2025-01-12'),
(72, 'Nutriboost Strawberry', 'Minuman', 'NS-4123-SWT', 5650, 7000, 9, 6, '2025-01-04', '2025-01-07'),
(73, 'Dunhill Hitam ', 'Rokok', 'DH-7255-SWT', 28700, 30000, 3, 6, '2025-01-04', '2025-01-17'),
(74, 'Dunhill Mild', 'Rokok', 'DM-1229-SWT', 28700, 30000, 3, 6, '2025-01-04', '2025-01-04'),
(75, 'Malboro Red', 'Rokok', 'MR-8544-SWT', 46000, 47000, 3, 6, '2025-01-04', '2025-01-09'),
(76, 'Djarum Super 16', 'Rokok ', 'DS1-4732-SWT', 30799, 32000, 2, 6, '2025-01-04', '2025-01-17'),
(77, 'Djarum Super 12', 'Rokok', 'DS1-6386-SWT', 22900, 24000, 1, 6, '2025-01-04', '2025-01-15'),
(78, 'Gudang Garam Surya 16', 'Rokok', 'GGS1-4918-SWT', 33251, 35000, 5, 6, '2025-01-04', '2025-01-17'),
(79, 'Sampoerna Prima', 'Rokok ', 'SP-8832-SWT', 14600, 16000, 8, 6, '2025-01-04', '2025-01-14'),
(80, 'Magnum Kretek', 'Rokok ', 'MK-2383-SWT', 16400, 18000, 4, 6, '2025-01-04', '2025-01-04'),
(81, 'Djarum 76 16', 'Rokok ', 'D71-8301-SWT', 19901, 21000, 9, 6, '2025-01-04', '2025-01-14'),
(83, 'Gudang Garam Surya 12', 'Rokok', 'GGS1-3675-SWT', 24000, 26000, 6, 6, '2025-01-04', '2025-01-17'),
(84, 'Djarum 76 12', 'Rokok', 'D71-8229-SWT', 14600, 16000, 5, 6, '2025-01-04', '2025-01-17'),
(85, 'La Bold', 'Rokok', 'LB-6093-SWT', 36151, 38000, 3, 6, '2025-01-04', '2025-01-04'),
(86, 'La Light ', 'Rokok ', 'LL-6407-SWT', 31700, 33000, 6, 6, '2025-01-04', '2025-01-06'),
(87, 'Sampoerna A Mild', 'Rokok', 'SAM-5278-SWT', 32801, 34000, 4, 6, '2025-01-04', '2025-01-17'),
(88, 'Djarum Black Cappuccino ', 'Rokok', 'DBC-6345-SWT', 31698, 33000, 2, 6, '2025-01-04', '2025-01-17'),
(89, 'Djarum Black ', 'Rokok ', 'DB-3843-SWT', 31698, 33000, 4, 6, '2025-01-04', '2025-01-14'),
(90, 'Dji Sam Soe Refill ', 'Rokok', 'DSSR-2526-SWT', 20300, 22000, 4, 6, '2025-01-04', '2025-01-15'),
(91, 'Dji Sam Soe Kretek 16', 'Rokok', 'DSSK1-8097-SWT', 25399, 27000, 0, 6, '2025-01-04', '2025-01-12'),
(92, 'Gudang Garam Merah 16', 'Rokok ', 'GGM1-4155-SWT', 17550, 19000, 10, 6, '2025-01-04', '2025-01-14'),
(93, 'Gudang Garam Merah 12', 'Rokok', 'GGM1-8324-SWT', 14500, 16000, 5, 6, '2025-01-04', '2025-01-04'),
(94, 'Gudang Garam Merah 10', 'Rokok', 'GGM1-7262-SWT', 12850, 14000, 3, 6, '2025-01-04', '2025-01-04'),
(95, 'Sampoerna 10+2', 'Rokok', 'S1-5978-SWT', 0, 16000, 4, 6, '2025-01-04', '2025-01-11'),
(96, 'Djarum Coklat Extra ', 'Rokok', 'DCE-5375-SWT', 14500, 16000, 6, 6, '2025-01-04', '2025-01-04'),
(97, 'Djarum Coklat Extra Mocca', 'Rokok ', 'DCEM-5792-SWT', 16000, 17000, 5, 6, '2025-01-04', '2025-01-04'),
(98, 'Gudang Garam Signature ', 'Rokok ', 'GGS-3420-SWT', 23200, 24000, 0, 6, '2025-01-04', '2025-01-12'),
(99, 'Avolution Merah 20', 'Rokok', 'AM2-1530-SWT', 40200, 42000, 5, 6, '2025-01-04', '2025-01-04'),
(100, 'Azimo Kretek 12', 'Rokok', 'AK1-7339-SWT', 7850, 9000, 5, 6, '2025-01-04', '2025-01-04'),
(101, 'Tenor Kretek 12', 'Rokok ', 'TK1-6699-SWT', 8950, 10000, 4, 6, '2025-01-04', '2025-01-11'),
(102, 'Gudang Garam Deluxe 16', 'Rokok', 'GGD1-8983-SWT', 18350, 19000, 0, 6, '2025-01-04', '2025-01-06'),
(103, 'Gudang Garam Deluxe 12', 'Rokok', 'GGD1-3857-SWT', 14650, 16000, 8, 6, '2025-01-04', '2025-01-14'),
(104, 'Tembakau Garangan ', 'Tembakau', 'TG-8114-FZI', 180000, 200000, 6, 5, '2025-01-04', '2025-01-04'),
(105, 'Tembakau Garangan ', 'Tembakau', 'TG-2990-FZI', 225000, 250000, 5, 5, '2025-01-04', '2025-01-04'),
(106, 'Tembakau Garangan', 'Tembakau', 'TG-5128-FZI', 270000, 300000, 4, 5, '2025-01-04', '2025-01-04'),
(107, 'Tembakau Garangan ', 'Tembakau', 'TG-4630-FZI', 360000, 400000, 3, 5, '2025-01-04', '2025-01-04'),
(108, 'Tembakau Garangan ', 'Tembakau', 'TG-5211-FZI', 315000, 350000, 2, 5, '2025-01-04', '2025-01-04'),
(109, 'Tembakau Garangan ', 'Tembakau', 'TG-6898-FZI', 450000, 500000, 3, 5, '2025-01-04', '2025-01-04'),
(110, 'Lintingan', 'Tembakau', 'L-8857-API', 8000, 10000, 15, 9, '2025-01-04', '2025-01-11'),
(111, 'Alat Linting', 'Tembakau', 'AL-8765-SWT', 3000, 7000, 40, 6, '2025-01-04', '2025-01-04'),
(112, 'Slorok', 'Tembakau', 'S-5842-SWT', 13000, 22000, 10, 6, '2025-01-04', '2025-01-04'),
(113, 'Violin', 'Tembakau', 'V-3656-SWT', 15400, 20000, 2, 6, '2025-01-04', '2025-01-10'),
(114, 'Lem', 'Tembakau', 'L-1054-SWT', 1167, 2000, 21, 6, '2025-01-04', '2025-01-06'),
(115, 'Virgin Apel', 'Tembakau', 'VA-3364-SWT', 20000, 25000, 5, 6, '2025-01-04', '2025-01-04'),
(116, 'Virgin Coffee ', 'Tembakau', 'VC-3827-SWT', 20000, 25000, 5, 6, '2025-01-04', '2025-01-04'),
(117, 'Virgin Vanilla ', 'Tembakau', 'VV-5354-SWT', 20000, 25000, 5, 6, '2025-01-04', '2025-01-04'),
(118, 'Mars Brand ', 'Tembakau', 'MB-4620-SWT', 15600, 20000, 5, 6, '2025-01-04', '2025-01-04'),
(119, 'Sw', 'Tembakau', 'S-4705-SWT', 13500, 18000, 12, 6, '2025-01-04', '2025-01-04'),
(120, 'Barrack', 'Tembakau', 'B-2566-SWT', 14000, 18000, 8, 6, '2025-01-04', '2025-01-04'),
(121, 'Phinisi', 'Tembakau', 'P-7369-SWT', 0, 8000, 29, 6, '2025-01-04', '2025-01-06'),
(122, 'Kopi Seduh', 'Minuman', 'KS-3688-SWT', 0, 5000, -3, 6, '2025-01-05', '2025-01-16'),
(123, 'Carica', 'Oleh-oleh', 'C-2467-KND', 10000, 15000, 48, 10, '2025-01-05', '2025-01-09'),
(124, 'Tembakau Iris Kecil', 'Tembakau', 'TIK-2597-SWT', NULL, 10000, NULL, 6, '2025-01-05', '2025-01-17'),
(125, 'Pipa Swating', 'Tembakau', 'PS-4573-SWT', NULL, 30000, 18, 6, '2025-01-05', '2025-01-05'),
(126, 'Pipa', 'Tembakau', 'P-2129-MKN', 25000, 30000, 8, 11, '2025-01-05', '2025-01-09'),
(127, 'Susu Jahe Seduh', 'Minuman', 'SJS-6873-SWT', NULL, 5000, NULL, 6, '2025-01-05', '2025-01-05'),
(128, 'Susu Seduh', 'Minuman', 'SS-8486-SWT', NULL, 5000, NULL, 6, '2025-01-05', '2025-01-07'),
(129, 'Energen Seduh', 'Minuman', 'ES-5894-SWT', NULL, 5000, NULL, 6, '2025-01-05', '2025-01-05'),
(130, 'Menyan Kecil', 'Tembakau', 'MK-3007-SWT', NULL, 3500, NULL, 6, '2025-01-05', '2025-01-09'),
(131, 'Menyan Sedang', 'Tembakau', 'MS-1677-SWT', NULL, 5000, NULL, 6, '2025-01-05', '2025-01-16'),
(132, 'Menyan Besar', 'Tembakau', 'MB-2152-SWT', NULL, 10000, NULL, 6, '2025-01-05', '2025-01-17'),
(133, 'Menyan Padat', 'Tembakau', 'MPB-3750-SWT', 0, 10000, 0, 6, '2025-01-05', '2025-01-09'),
(134, 'Cerutu Hijau', 'Tembakau', 'CH-6298-SWT', NULL, 30000, NULL, 6, '2025-01-05', '2025-01-14'),
(135, 'Garet Sinden', 'Tembakau', 'GS-3978-SWT', NULL, 1000, -1, 6, '2025-01-05', '2025-01-16'),
(136, 'Rokok Eceran', 'Rokok', 'RE-5061-SWT', NULL, 2500, 27, 6, '2025-01-05', '2025-01-11'),
(137, 'Korek', 'Rokok', 'K-5860-SWT', NULL, 2000, 26, 6, '2025-01-05', '2025-01-17'),
(138, 'Garet Burung', 'Tembakau', 'GB-6904-SWT', 0, 1000, 85, 6, '2025-01-06', '2025-01-17'),
(139, 'Garet Buffalo', 'Tembakau', 'GB-8426-SWT', 0, 500, 96, 6, '2025-01-06', '2025-01-17'),
(140, 'Selpi', 'Tembakau', 'S-5322-SWT', 0, 30000, 7, 6, '2025-01-06', '2025-01-16'),
(141, 'Mantol Stelan Tebal', 'Aksesoris', 'MST-1107-SWT', 0, 20000, 0, 6, '2025-01-06', '2025-01-11'),
(142, 'Tembakau Iris Besar', 'Tembakau', 'TIB-3556-SWT', NULL, 20000, NULL, 6, '2025-01-06', '2025-01-12'),
(143, 'Lintingan', 'Tembakau', 'L-1341-SDK', 8000, 10000, 0, 12, '2025-01-06', '2025-01-06'),
(144, 'Tembakau Tis Surya Besar', 'Tembakau', 'TTSB-4307-SWT', NULL, 25000, 2, 6, '2025-01-07', '2025-01-09'),
(145, 'Tembakau Tis Ggf Besar', 'Tembakau', 'TTGB-2469-SWT', NULL, 25000, 4, 6, '2025-01-07', '2025-01-07'),
(146, 'Tembakau Tis Refill', 'Tembakau', 'TTR-3821-SWT', NULL, 25000, 4, 6, '2025-01-07', '2025-01-07'),
(147, 'Tembakau Tis Surya Kecil', 'Tembakau', 'TTSK-8466-SWT', NULL, 15000, 12, 6, '2025-01-07', '2025-01-07'),
(148, 'Tembakau Tis Ggf Kecil', 'Tembakau', 'TTGK-2755-SWT', NULL, 15000, 12, 6, '2025-01-07', '2025-01-07'),
(149, 'Tembakau Tis Refill Kecil', 'Tembakau', 'TTRK-5903-SWT', NULL, 15000, 12, 6, '2025-01-07', '2025-01-07'),
(150, 'Mie Lidi', 'Oleh-oleh', 'ML-9234-NUR', 11000, 13000, 4, 3, '2025-01-07', '2025-01-07'),
(151, 'Sambal', 'Oleh-oleh', 'S-5957-MAT', NULL, 14000, NULL, 13, '2025-01-07', '2025-01-07'),
(152, 'Pop Mie Seduh', 'Makanan', 'PMS-2828-SWT', 6000, 10000, NULL, 6, '2025-01-07', '2025-01-13'),
(153, 'Pop Mie Non Seduh', 'Makanan', 'PMNS-3092-SWT', NULL, 6000, NULL, 6, '2025-01-07', '2025-01-07'),
(154, 'Susu Non Seduh', 'Minuman', 'SNS-8028-SWT', NULL, 2000, NULL, 6, '2025-01-07', '2025-01-10'),
(155, 'Energen Non Seduh', 'Minuman', 'ENS-9761-SWT', NULL, 2000, NULL, 6, '2025-01-07', '2025-01-07'),
(156, 'Lembutan', 'Tembakau', 'L-3417-SWT', NULL, 15000, NULL, 6, '2025-01-08', '2025-01-08'),
(157, 'Lembutan', 'Tembakau', 'L-1044-SWT', NULL, 5000, NULL, 6, '2025-01-08', '2025-01-08'),
(158, 'Lembutan', 'Tembakau', 'L-6350-SWT', NULL, 25000, NULL, 6, '2025-01-08', '2025-01-08'),
(159, 'Lembutan', 'Tembakau', 'L-9485-SWT', NULL, 20000, NULL, 6, '2025-01-08', '2025-01-08'),
(160, 'Lembutan', 'Tembakau', 'L-3284-SWT', NULL, 40000, NULL, 6, '2025-01-08', '2025-01-08'),
(161, 'Stik', 'Oleh-oleh', 'S-4237-SWT', NULL, 15000, NULL, 6, '2025-01-08', '2025-01-08'),
(162, 'Keripik Tempe', 'Oleh-oleh', 'KT-2511-SWT', NULL, 20000, NULL, 6, '2025-01-08', '2025-01-08'),
(163, 'Keripik Tempe Popo', 'Oleh-oleh', 'KTP-3093-MAT', NULL, 18000, 4, 13, '2025-01-08', '2025-01-09'),
(164, 'Combro Kentang', 'Oleh-oleh', 'CK-9561-MAT', NULL, 17000, 3, 13, '2025-01-08', '2025-01-09'),
(165, 'Pangsit', 'Oleh-oleh', 'P-7682-SWT', NULL, 15000, NULL, 6, '2025-01-08', '2025-01-08'),
(166, 'Cengkeh Lawet', 'Tembakau', 'CL-7415-SWT', 925, 1000, 3, 6, '2025-01-08', '2025-01-09'),
(167, 'Cengkeh Medan', 'Tembakau', 'CM-5012-SWT', NULL, 6000, 1, 6, '2025-01-08', '2025-01-09'),
(168, 'Cengkeh Medan', 'Tembakau', 'CM-6976-SWT', NULL, 11000, NULL, 6, '2025-01-08', '2025-01-08'),
(169, 'Lintingan', 'Tembakau', 'L-8260-DDI', NULL, 10000, 6, 14, '2025-01-09', '2025-01-09'),
(170, 'Cerutu Box', 'Tembakau', 'CB-4779-SWT', NULL, 100000, NULL, 6, '2025-01-09', '2025-01-09'),
(171, 'Chocolatos Seduh', 'Minuman', 'CS-1838-SWT', NULL, 5000, NULL, 6, '2025-01-09', '2025-01-09'),
(172, 'Kopi Non Seduh', 'Minuman', 'KNS-6019-SWT', NULL, 2000, NULL, 6, '2025-01-10', '2025-01-10'),
(173, 'Menyan 8k', 'Tembakau', 'M8-8728-SWT', NULL, 8000, NULL, 6, '2025-01-10', '2025-01-10'),
(174, 'Cup', 'Minuman', 'C-1200-SWT', NULL, 2000, NULL, 6, '2025-01-11', '2025-01-12'),
(175, 'Dji Sam Soe Refill 16', 'Rokok', 'DSSR1-3884-SWT', 25000, 26000, 4, 6, '2025-01-13', '2025-01-13'),
(176, 'Garet Burung Besar', 'Tembakau', 'GBB-9461-SWT', 0, 1500, 110, 6, '2025-01-14', '2025-01-14');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `barang`
--
ALTER TABLE `barang`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=177;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
