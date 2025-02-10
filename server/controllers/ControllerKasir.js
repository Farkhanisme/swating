import { db } from "../database/db.js";

export const getBarang = async (req, res) => {
  const { kategori } = req.query;

  db.all("SELECT * FROM barang", (err, rows) => {
    if (err) {
      console.error("Error fetching tables:", err.message);
    } else {
      res.json(rows);
    }
  });
};

export const getPenjualan = async (req, res) => {
  const { kategori } = req.query;

  db.all("SELECT * FROM penjualan", (err, rows) => {
    if (err) {
      console.error("Error fetching tables:", err.message);
    } else {
      res.json(rows);
    }
  });
};

export const getTotal = async (req, res) => {
  const { kategori } = req.query;
  db.all("SELECT * FROM barang", (err, rows) => {
    if (err) {
      console.error("Error fetching tables:", err.message);
    } else {
      res.json(rows);
    }
  });
};

export const getPengeluaran = async (req, res) => {
  const select = `SELECT * FROM pengeluaran ORDER BY tanggal DESC;`;
  db.all("SELECT * FROM barang", (err, rows) => {
    if (err) {
      console.error("Error fetching tables:", err.message);
    } else {
      res.json(rows);
    }
  });
};

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

    const updateStock = `
      UPDATE barang 
      SET stock = stock - ? 
      WHERE id = ?
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
      await new Promise((resolve, reject) => {
        db.run(updateStock, [jumlahTerjual, barangId], (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
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

export const insertPengeluaran = async (req, res) => {
  const { nominal, keterangan } = req.body;

  const insert =
    "INSERT INTO pengeluaran (nominal, keterangan, tanggal) VALUES (?, ?, CURDATE())";

  try {
    await query(insert, [nominal, keterangan]);
    res.status(201).json({
      message: "Data berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Error saat menambahkan barang:", error.message);
    res.status(500).json({
      message: "Terjadi kesalahan saat menambahkan data",
      error: error.message,
    });
  }
};
