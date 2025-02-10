import { db } from "../database/db.js";

export const insertPenitip = async (req, res) => {
  const { namaPenitip, kodePenitip } = req.body;

  const insertPenitip =
    "INSERT INTO penitip (nama, kode, created_at, updated_at) VALUES (?, ?, DATE('now'), DATE('now'))";
  try {
    db.run(insertPenitip, [namaPenitip, kodePenitip], function (err) {
      if (err) {
        console.error("Error saat menambahkan barang:", err.message);
        return res.status(500).json({
          message: "Terjadi kesalahan saat menambahkan barang",
          error: err.message,
        });
      }
      res.status(201).json({
        message: "Penitip berhasil ditambahkan",
      });
    });
  } catch (error) {
    console.error("Error saat menambahkan penitip:", error.message);
    res.status(500).json({
      message: "Terjadi kesalahan saat menambahkan penitip",
      error: error.message,
    });
  }
};

export const getPenitip = async (req, res) => {
  db.all(`SELECT * FROM penitip`, (err, rows) => {
    if (err) {
      console.error("Error fetching tables:", err.message);
    } else {
      res.json(rows);
    }
  });
};
