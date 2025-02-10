import { db } from "../database/db.js";

export const getPenjualan = async (req, res) => {
  db.all(
    `SELECT 
        barang.namaBarang, 
        penjualan.tanggal,
        penitip.nama AS penitip,
        barang.kategoriBarang,
        SUM(penjualan.jumlahTerjual) AS totalTerjual,
        SUM(barang.hargaJual * penjualan.jumlahTerjual) AS totalHarga,
        SUM(barang.hargaAwal * penjualan.jumlahTerjual) AS totalSetor
    FROM 
        penjualan 
    JOIN 
        barang ON penjualan.barangId = barang.id
    LEFT JOIN 
        penitip ON barang.penitipId = penitip.id
    GROUP BY 
        barang.namaBarang, penitip.nama, penjualan.tanggal

    UNION ALL

    SELECT 
        penjualan_lain.namaBarang, 
        penjualan_lain.tanggal,
        penjualan_lain.penitip AS penitip,
        penjualan_lain.kategoriBarang,
        SUM(penjualan_lain.jumlahTerjual) AS totalTerjual,
        SUM(penjualan_lain.totalHarga) AS totalHarga,
        SUM(0) AS totalSetor
    FROM 
        penjualan_lain 
    GROUP BY 
        penjualan_lain.namaBarang, penjualan_lain.penitip, penjualan_lain.tanggal

    ORDER BY 
        tanggal DESC, totalTerjual DESC`,
    (err, rows) => {
      if (err) {
        console.error("Error fetching tables:", err.message);
      } else {
        res.json(rows);
      }
    }
  );
};

export const getPenjualanLain = async (req, res) => {
  const query = `
    SELECT 
      id, 
      namaBarang, 
      jumlahTerjual, 
      totalHarga, 
      totalSetor, 
      penitip, 
      kategoriBarang, 
      tanggal 
    FROM penjualan_lain 
    ORDER BY tanggal DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching data:", err.message);
      return res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
    res.json(rows);
  });
};

export const tambahPenjualanLain = async (req, res) => {
  const {
    namaBarang,
    jumlahTerjual,
    totalHarga,
    totalSetor,
    penitip,
    kategoriBarang,
    tanggal,
  } = req.body;

  if (!namaBarang || !jumlahTerjual || !totalHarga) {
    return res
      .status(400)
      .json({ success: false, message: "Data tidak lengkap" });
  }

  const query = `
    INSERT INTO penjualan_lain (namaBarang, jumlahTerjual, totalHarga, totalSetor, penitip, kategoriBarang, tanggal)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      namaBarang,
      jumlahTerjual,
      totalHarga,
      totalSetor || null,
      penitip || null,
      kategoriBarang || null,
      tanggal || new Date().toISOString().split("T")[0],
    ],
    function (err) {
      if (err) {
        console.error("Error inserting data:", err.message);
        return res
          .status(500)
          .json({ success: false, message: "Gagal menambahkan data" });
      }

      res.json({
        success: true,
        message: "Penjualan berhasil ditambahkan",
        id: this.lastID,
      });
    }
  );
};

export const deletePenjualanLain = async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM penjualan_lain WHERE id = ?";

  db.run(query, [id], function (err) {
    if (err) {
      console.error("Error deleting data:", err.message);
      return res
        .status(500)
        .json({ success: false, message: "Gagal menghapus data" });
    }
    res.json({ success: true, message: "Data berhasil dihapus" });
  });
};

export const getPenjualanPerhari = async (req, res) => {
  db.all(
    `SELECT 
        barang.namaBarang, 
        penjualan.tanggal,
        penitip.nama,
        SUM(penjualan.jumlahTerjual) AS totalTerjual,
        SUM(barang.hargaJual * penjualan.jumlahTerjual) AS totalHarga
    FROM 
        penjualan
    JOIN 
        barang ON penjualan.barangId = barang.id
    LEFT JOIN 
        penitip ON barang.penitipId = penitip.id
    WHERE
        penjualan.tanggal = DATE('now')
    GROUP BY 
        barang.namaBarang, penitip.nama, penjualan.tanggal
    ORDER BY 
        penjualan.tanggal DESC`,
    (err, rows) => {
      if (err) {
        console.error("Error fetching tables:", err.message);
      } else {
        res.json(rows);
      }
    }
  );
};

export const deleteRiwayatPenjualan = async (req, res) => {
  const { id } = req.params;

  // Ambil data penjualan sebelum dihapus
  const getPenjualanQuery =
    "SELECT barangId, jumlahTerjual, tanggal FROM penjualan WHERE id = ?";

  db.get(getPenjualanQuery, [id], (err, penjualan) => {
    if (err) {
      console.error("Error fetching data:", err.message);
      return res
        .status(500)
        .json({ success: false, message: "Gagal mengambil data" });
    }

    if (!penjualan) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }

    const { barangId, jumlahTerjual, tanggal } = penjualan;

    // Hapus data penjualan
    const deleteRiwayatPenjualan = "DELETE FROM penjualan WHERE id = ?";
    db.run(deleteRiwayatPenjualan, [id], function (err) {
      if (err) {
        console.error("Error deleting data:", err.message);
        return res
          .status(500)
          .json({ success: false, message: "Gagal menghapus data" });
      }

      if (this.changes === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Data tidak ditemukan" });
      }

      // Kurangi jumlah terjual di stok_barang
      const updateStockQuery = `
      UPDATE stok_barang
      SET terjual = terjual - ?
      WHERE barang_id = ? AND tanggal_terjual = ? AND terjual >= ?
    `;

      db.run(
        updateStockQuery,
        [jumlahTerjual, barangId, tanggal, jumlahTerjual],
        function (err) {
          if (err) {
            console.error("Error updating stok_barang:", err.message);
            return res
              .status(500)
              .json({ success: false, message: "Gagal mengupdate stok" });
          }

          res.json({
            success: true,
            message: `Data penjualan dengan ID ${id} berhasil dihapus dan stok diperbarui`,
          });
        }
      );
    });
  });
};

export const getRiwayatPenjualan = async (req, res) => {
  db.all(
    `
      SELECT 
        penjualan.id,
        barang.namaBarang, 
        penjualan.tanggal,
        penitip.nama,
        penjualan.jumlahTerjual,
        (barang.hargaJual * penjualan.jumlahTerjual) AS totalHarga
    FROM 
        penjualan 
    JOIN 
        barang ON penjualan.barangId = barang.id
    LEFT JOIN 
        penitip ON barang.penitipId = penitip.id
    ORDER BY 
        penjualan.tanggal DESC
      `,
    (err, rows) => {
      if (err) {
        console.error("Error fetching tables:", err.message);
      } else {
        res.json(rows);
      }
    }
  );
};
