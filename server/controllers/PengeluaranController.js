import { db } from "../database/db.js";

export const insertPengeluaran = async (req, res) => {
  const { nominal, keterangan, tanggal } = req.body; // Tanggal dikirim dari frontend

  const insert =
    "INSERT INTO pengeluaran (nominal, keterangan, tanggal) VALUES (?, ?, ?)";

  try {
    await db.run(insert, [nominal, keterangan, tanggal]); // Gunakan tanggal dari frontend
    res.status(201).json({
      message: "Data berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Error saat menambahkan pengeluaran:", error.message);
    res.status(500).json({
      message: "Terjadi kesalahan saat menambahkan data",
      error: error.message,
    });
  }
};

export const deletePengeluaran = async (req, res) => {
  const { id } = req.params;

  const deletePengeluaran = "DELETE FROM pengeluaran WHERE id = ?";
  try {
    await db.run(deletePengeluaran, [id]);

    res.status(200).json({
      message: "Pengeluaran berhasil dihapus",
    });
  } catch (error) {
    console.error("Error saat menghapus pengeluaran:", error.message);
    res.status(500).json({
      message: "Terjadi kesalahan saat menghapus pengeluaran",
      error: error.message,
    });
  }
};

export const updatePengeluaran = async (req, res) => {
  const { id } = req.params;
  const { nominal, keterangan, tanggal } = req.body;

  const updateQuery =
    "UPDATE pengeluaran SET nominal = ?, keterangan = ?, tanggal = ? WHERE id = ?";

  try {
    await db.run(updateQuery, [nominal, keterangan, tanggal, id]);
    res.status(200).json({
      message: "Pengeluaran berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error saat mengedit pengeluaran:", error.message);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengedit pengeluaran",
      error: error.message,
    });
  }
};

export const getPengeluaran = async (req, res) => {
  db.all("SELECT * FROM pengeluaran ORDER BY tanggal ASC", (err, rows) => {
    if (err) {
      console.error("Error fetching pengeluaran:", err.message);
      res.status(500).json({ message: "Gagal mengambil data" });
    } else {
      res.json(rows);
    }
  });
};
