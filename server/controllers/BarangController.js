import { db } from "../database/db.js";

export const checkout = async (req, res) => {
  try {
    if (!Array.isArray(req.body.data)) {
      return res.status(400).json({
        success: false,
        message: "Format data tidak valid",
      });
    }

    const insertPenjualan = `
      INSERT INTO penjualan 
        (barangId, jumlahTerjual, tanggal) 
      VALUES 
        (?, ?, COALESCE(?, DATE('now')))
    `;

    const updateTerjual = `
      UPDATE stok_barang 
      SET terjual = terjual + ?, tanggal_terjual = DATE('now') 
      WHERE barang_id = ?
    `;

    // Mulai transaksi manual
    db.run("BEGIN TRANSACTION");

    for (const item of req.body.data) {
      const { barangId, jumlahTerjual, tanggal } = item;

      // Validasi data item
      if (
        !barangId ||
        !jumlahTerjual ||
        isNaN(jumlahTerjual) ||
        jumlahTerjual <= 0
      ) {
        db.run("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: `Data tidak valid untuk barang ID: ${barangId}`,
        });
      }

      // Insert penjualan
      await new Promise((resolve, reject) => {
        db.run(insertPenjualan, [barangId, jumlahTerjual, tanggal], (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      // Update stok
      // await new Promise((resolve, reject) => {
      //   db.run(updateTerjual, [jumlahTerjual, barangId], (err) => {
      //     if (err) return reject(err);
      //     resolve();
      //   });
      // });
    }

    // Commit transaksi
    db.run("COMMIT");

    res.status(201).json({
      success: true,
      message: "Transaksi berhasil dilakukan",
    });
  } catch (error) {
    db.run("ROLLBACK");
    console.error("Error dalam proses checkout:", error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memproses transaksi",
      error: error.message,
    });
  }
};

export const insertBarang = async (req, res) => {
  const {
    namaBarang,
    kategoriBarang,
    penitipId,
    hargaAwal,
    hargaJual,
    kodeProduk,
  } = req.body;

  const insertBarang =
    "INSERT INTO barang (namaBarang, kategoriBarang, kodeProduk, hargaAwal, hargaJual, penitipId, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, DATE('now'), DATE('now'))";

  try {
    db.run(
      insertBarang,
      [
        namaBarang,
        kategoriBarang,
        kodeProduk,
        hargaAwal || null,
        hargaJual,
        penitipId,
      ],
      function (err) {
        if (err) {
          console.error("Error saat menambahkan barang:", err.message, req.body);
          return res.status(500).json({
            message: "Terjadi kesalahan saat menambahkan barang",
            error: err.message,
          });
        }
        res.status(201).json({
          message: "Barang berhasil ditambahkan",
        });
      }
    );
  } catch (error) {
    console.error("Error saat menambahkan barang:", error.message);
    res.status(500).json({
      message: "Terjadi kesalahan saat menambahkan barang",
      error: error.message,
    });
  }
};

export const getBarang = async (req, res) => {
  db.all(
    "SELECT barang.id, barang.penitipId, barang.kodeProduk, barang.namaBarang, barang.hargaAwal, barang.hargaJual, barang.kategoriBarang, penitip.nama FROM barang LEFT JOIN penitip ON barang.penitipId = penitip.id ORDER BY barang.kategoriBarang ASC, barang.namaBarang ASC",
    (err, rows) => {
      if (err) {
        console.error("Error fetching tables:", err.message);
      } else {
        res.json(rows);
      }
    }
  );
};

export const updateBarang = async (req, res) => {
  const { id } = req.params;
  const {
    namaBarang,
    kategoriBarang,
    penitipId,
    hargaAwal,
    hargaJual,
    kodeProduk,
  } = req.body;

  const updateBarang = `
      UPDATE barang 
      SET 
        namaBarang = ?, 
        kategoriBarang = ?, 
        kodeProduk = ?, 
        hargaAwal = ?, 
        hargaJual = ?, 
        penitipId = ?, 
        updated_at = DATE('now') 
      WHERE id = ?`;

  db.run(
    updateBarang,
    [
      namaBarang,
      kategoriBarang,
      kodeProduk,
      hargaAwal,
      hargaJual,
      penitipId,
      id,
    ],
    function (err) {
      if (err) {
        console.error("Error saat memperbarui barang:", err.message);
        return res.status(500).json({
          message: "Terjadi kesalahan saat memperbarui barang",
          error: err.message,
        });
      }

      res.status(200).json({
        message: "Barang berhasil diperbarui",
      });
    }
  );
};

export const deleteBarang = (req, res) => {
  const { id } = req.params;

  const deleteBarangQuery = "DELETE FROM barang WHERE id = ?";
  
  db.run(deleteBarangQuery, [id], function (err) {
    if (err) {
      console.error("Error saat menghapus barang:", err.message);
      return res.status(500).json({
        message: "Terjadi kesalahan saat menghapus barang",
        error: err.message,
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        message: "Barang tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Barang berhasil dihapus",
    });
  });
};
