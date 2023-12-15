-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Gegenereerd op: 15 dec 2023 om 08:10
-- Serverversie: 5.7.39
-- PHP-versie: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `axs`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `paypals`
--

CREATE TABLE `paypals` (
  `id` int(11) NOT NULL,
  `mail` varchar(255) NOT NULL,
  `isUsed` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden geëxporteerd voor tabel `paypals`
--

INSERT INTO `paypals` (`id`, `mail`, `isUsed`) VALUES
(1, 'test1@gmail.com', 0),
(2, 'test2@gmail.com', 1);

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `paypals`
--
ALTER TABLE `paypals`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `paypals`
--
ALTER TABLE `paypals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
