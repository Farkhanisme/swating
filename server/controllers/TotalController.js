import { db } from "../database/db.js";

export const getTotal = async (req, res) => {
  db.all(
    `SELECT penjualan.tanggal, SUM(barang.hargaJual * penjualan.jumlahTerjual) AS totalTerjual, SUM(barang.hargaAwal * penjualan.jumlahTerjual) AS totalSetor FROM penjualan JOIN barang ON penjualan.barangId = barang.id WHERE penjualan.status != "Lunas" GROUP BY penjualan.tanggal ORDER BY penjualan.tanggal DESC`,
    (err, rows) => {
      if (err) {
        console.error("Error fetching tables:", err.message);
      } else {
        res.json(rows);
      }
    }
  );
};

export const getTotalPerhari = async (req, res) => {
  db.all(
    `SELECT penjualan.tanggal, SUM(barang.hargaJual * penjualan.jumlahTerjual) AS totalTerjual FROM penjualan JOIN barang ON penjualan.barangId = barang.id WHERE penjualan.tanggal = DATE('now') GROUP BY penjualan.tanggal ORDER BY penjualan.tanggal DESC`,
    (err, rows) => {
      if (err) {
        console.error("Error fetching tables:", err.message);
      } else {
        res.json(rows);
      }
    }
  );
};

export const getAllTotal = async (req, res) => {
  db.all(
    `SELECT 
        strftime('%Y-%m', penjualan.tanggal) AS bulan,
        SUM(barang.hargaJual * penjualan.jumlahTerjual) AS totalTerjual,
        SUM(barang.hargaAwal * penjualan.jumlahTerjual) AS totalSetor
     FROM penjualan 
     JOIN barang ON penjualan.barangId = barang.id 
     WHERE penjualan.status != "Lunas"
     GROUP BY bulan
     ORDER BY bulan DESC`,
    (err, rows) => {
      if (err) {
        console.error("Error fetching tables:", err.message);
        res.status(500).json({ error: "Terjadi kesalahan pada server" });
      } else {
        res.json(rows);
      }
    }
  );
};
