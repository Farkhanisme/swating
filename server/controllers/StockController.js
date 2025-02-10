import { db } from "../database/db.js";

export const getAllStock = async (req, res) => {
  db.all(
    `SELECT s.*, b.namaBarang 
     FROM stok_barang s
     JOIN barang b ON s.barang_id = b.id`,
    [],
    (err, stock) => {
      if (err) {
        console.error("Error mengambil data stok:", err);
        return res.status(500).json({ error: "Terjadi kesalahan pada server" });
      }

      res.json({ stock });
    }
  );
};

export const getStock = async (req, res) => {
  db.all(
    "SELECT DISTINCT tanggal_masuk FROM stok_barang ORDER BY tanggal_masuk",
    [],
    (err, masukDates) => {
      if (err) {
        console.error("Error mengambil tanggal masuk:", err);
        return res.status(500).json({ error: "Terjadi kesalahan pada server" });
      }

      db.all(
        "SELECT DISTINCT tanggal_terjual FROM stok_barang WHERE tanggal_terjual IS NOT NULL ORDER BY tanggal_terjual",
        [],
        (err, terjualDates) => {
          if (err) {
            console.error("Error mengambil tanggal terjual:", err);
            return res
              .status(500)
              .json({ error: "Terjadi kesalahan pada server" });
          }

          // Jika tidak ada data, kirim response kosong
          if (masukDates.length === 0 && terjualDates.length === 0) {
            return res.json({ stok: [], terjual: [] });
          }

          // Buat kolom stok hanya jika ada tanggal masuk
          let masukColumns = masukDates
            .map(
              (d) =>
                `MAX(CASE WHEN tanggal_masuk = '${d.tanggal_masuk}' THEN stock END) AS '${d.tanggal_masuk}'`
            )
            .join(", ");
          let terjualColumns = terjualDates
            .map(
              (d) =>
                `MAX(CASE WHEN tanggal_terjual = '${d.tanggal_terjual}' THEN terjual END) AS '${d.tanggal_terjual}'`
            )
            .join(", ");

          // Jika tidak ada tanggal masuk atau terjual, set query agar tetap valid
          masukColumns = masukColumns || "NULL AS kosong";
          terjualColumns = terjualColumns || "NULL AS kosong";

          const stokQuery = `
          SELECT barang.namaBarang AS namaBarang, ${masukColumns}
          FROM stok_barang
          JOIN barang ON stok_barang.barang_id = barang.id
          GROUP BY barang.namaBarang
        `;

          db.all(stokQuery, [], (err, stokRows) => {
            if (err) {
              console.error("Error mengambil data stok:", err);
              return res
                .status(500)
                .json({ error: "Terjadi kesalahan pada server" });
            }

            const terjualQuery = `
            SELECT barang.namaBarang AS namaBarang, ${terjualColumns}
            FROM stok_barang
            JOIN barang ON stok_barang.barang_id = barang.id
            GROUP BY barang.namaBarang
          `;

            db.all(terjualQuery, [], (err, terjualRows) => {
              if (err) {
                console.error("Error mengambil data terjual:", err);
                return res
                  .status(500)
                  .json({ error: "Terjadi kesalahan pada server" });
              }

              res.json({ stok: stokRows, terjual: terjualRows });
            });
          });
        }
      );
    }
  );
};

export const tambahStock = (req, res) => {
  const { barang_id, stock, harga_beli, tempat, tanggal_masuk } = req.body;

  // Validasi input
  if (!barang_id || !stock || !harga_beli || !tanggal_masuk) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }

  const query = `
      INSERT INTO stok_barang (barang_id, stock, harga_beli, tempat, tanggal_masuk)
      VALUES (?, ?, ?, ?, ?)
    `;

  db.run(
    query,
    [barang_id, stock, harga_beli, tempat, tanggal_masuk],
    function (err) {
      if (err) {
        console.error("Gagal menambahkan stok:", err);
        return res.status(500).json({ error: "Gagal menambahkan stok" });
      }

      res.json({ message: "Stok berhasil ditambahkan", id: this.lastID });
    }
  );
};

export const updateStock = (req, res) => {
  const { id } = req.params; // ID stok yang akan diupdate
  const { stock, tanggal_masuk, harga_beli, tempat } = req.body;

  // Validasi input
  if (!stock || !tanggal_masuk) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }

  // Query Update
  const query = `UPDATE stok_barang SET stock = ?, tanggal_masuk = ?, harga_beli = ?, tempat = ? WHERE id = ?`;

  db.run(query, [stock, tanggal_masuk, harga_beli, tempat, id], function (err) {
    if (err) {
      console.error("Gagal memperbarui stok:", err);
      return res.status(500).json({ error: "Gagal memperbarui stok" });
    }

    res.json({ message: "Stok berhasil diperbarui" });
  });
};

export const deleteStock = (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM stok_barang WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) {
      console.error("Gagal menghapus stok:", err);
      return res.status(500).json({ error: "Gagal menghapus stok" });
    }

    res.json({ message: "Stok berhasil dihapus" });
  });
};
