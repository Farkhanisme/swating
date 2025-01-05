import { query } from "../database/db.js";

export const insertBarang = async (req, res) => {
  const {
    namaBarang,
    kategoriBarang,
    penitipId,
    hargaAwal,
    hargaJual,
    stock,
    kodeProduk,
  } = req.body;

  const insertBarang =
    "INSERT INTO barang (namaBarang, kategoriBarang, kodeProduk, hargaAwal, hargaJual, stock, penitipId, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), CURDATE())";
  try {
    const result = await query(insertBarang, [
      namaBarang,
      kategoriBarang,
      kodeProduk,
      hargaAwal || null,
      hargaJual,
      stock || null,
      penitipId || null,
    ]);

    res.status(201).json({
      message: "Barang berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Error saat menambahkan barang:", error.message);
    res.status(500).json({
      message: "Terjadi kesalahan saat menambahkan barang",
      error: error.message,
    });
  }
};

export const getBarang = async (req, res) => {
  const { kategori } = req.query;
  const select = `
    SELECT 
        barang.id, 
        barang.namaBarang, 
        barang.kategoriBarang, 
        barang.kodeProduk, 
        barang.hargaAwal, 
        barang.hargaJual, 
        barang.stock, 
        barang.penitipId,
        penitip.nama AS namaPenitip
    FROM 
        barang 
    LEFT JOIN 
        penitip 
    ON 
        barang.penitipId = penitip.id
    WHERE 
        barang.kategoriBarang = ? OR ? = ''
  `;
  try {
    const result = await query(select, [kategori, kategori]);
    res.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      error: "Gagal mengambil data",
      details: error.message,
    });
  }
};

export const getPenjualan = async (req, res) => {
  const select = `
  SELECT 
      barang.namaBarang, 
      penjualan.tanggal,
      penitip.nama,
      barang.stock,
      SUM(penjualan.jumlahTerjual) AS totalTerjual,
      SUM(penjualan.totalHarga) AS totalHarga
  FROM 
      penjualan 
  JOIN 
      barang ON penjualan.barangId = barang.id
  LEFT JOIN 
      penitip ON barang.penitipId = penitip.id
  GROUP BY 
      barang.namaBarang, penitip.nama, barang.stock, penjualan.tanggal
  ORDER BY 
      penjualan.tanggal DESC
  `;
  try {
    const result = await query(select);
    res.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      error: "Gagal mengambil data",
      details: error.message,
    });
  }
};

export const getTotal = async (req, res) => {
  const select = `SELECT tanggal, SUM(totalHarga) AS totalTerjual FROM penjualan GROUP BY tanggal ORDER BY tanggal DESC`;
  try {
    const result = await query(select);
    res.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      error: "Gagal mengambil data",
      details: error.message,
    });
  }
};

export const getAllTotal = async (req, res) => {
  const select = `SELECT SUM(totalHarga) AS totalTerjual, SUM(totalSetor) AS totalSetor FROM penjualan`;
  try {
    const result = await query(select);
    res.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      error: "Gagal mengambil data",
      details: error.message,
    });
  }
};

export const getSetor = async (req, res) => {
  const select = `SELECT 
    barang.penitipId, 
    penitip.nama,
    SUM(penjualan.totalHarga) AS totalTerjual, 
    SUM(penjualan.totalSetor) AS totalSetor
FROM 
    penjualan
JOIN 
    barang ON penjualan.barangId = barang.id
LEFT JOIN
    penitip ON barang.penitipId = penitip.id
GROUP BY 
    barang.penitipId;
`;
  try {
    const result = await query(select);
    res.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      error: "Gagal mengambil data",
      details: error.message,
    });
  }
};

export const checkout = async (req, res) => {
  const insertBarang =
    "INSERT INTO penjualan (barangId, jumlahTerjual, totalHarga,totalSetor , tanggal) VALUES (?, ?, ?, ?, CURDATE())";

  try {
    for (const item of req.body.data) {
      const { barangId, jumlahTerjual, totalHarga, totalSetor } = item;

      if (!barangId || !jumlahTerjual || !totalHarga) {
        console.error("Data tidak valid:", item);
        continue;
      }

      await query(insertBarang, [
        barangId,
        jumlahTerjual,
        totalHarga,
        totalSetor,
      ]);
    }

    res.status(201).json({
      message: "Semua barang berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Error saat menambahkan barang:", error.message);
    res.status(500).json({
      message: "Terjadi kesalahan saat menambahkan barang",
      error: error.message,
    });
  }
};

export const insertPenitip = async (req, res) => {
  const { namaPenitip, kodePenitip } = req.body;

  const insertPenitip =
    "INSERT INTO penitip (nama, kode, created_at, updated_at) VALUES (?, ?, CURDATE(), CURDATE())";
  try {
    const result = await query(insertPenitip, [namaPenitip, kodePenitip]);

    res.status(201).json({
      message: "Penitip berhasil ditambahkan",
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
  const select = "SELECT * FROM penitip";
  try {
    const result = await query(select);
    res.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      error: "Gagal mengambil data",
      details: error.message,
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

export const updateBarang = async (req, res) => {
  const { id } = req.params;
  const {
    namaBarang,
    kategoriBarang,
    penitipId,
    hargaAwal,
    hargaJual,
    stock,
    kodeProduk,
  } = req.body;

  const updateBarang =
    "UPDATE barang SET namaBarang = ?, kategoriBarang = ?, kodeProduk = ?, hargaAwal = ?, hargaJual = ?, stock = ?, penitipId = ?, updated_at = CURDATE() WHERE id = ?";
  try {
    const result = await query(updateBarang, [
      namaBarang,
      kategoriBarang,
      kodeProduk,
      hargaAwal,
      hargaJual,
      stock,
      penitipId,
      id,
    ]);

    res.status(201).json({
      message: "Barang berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Error saat menambahkan barang:", error.message);
    res.status(500).json({
      message: "Terjadi kesalahan saat menambahkan barang",
      error: error.message,
    });
  }
};

export const deleteBarang = async (req, res) => {
  const { id } = req.params;

  const deleteBarang = "DELETE FROM barang WHERE id = ?";
  try {
    const result = await query(deleteBarang, [id]);

    res.status(201).json({
      message: "Barang berhasil dihapus",
    });
  } catch (error) {
    console.error("Error saat menghapus barang:", error.message);
    res.status(500).json({
      message: "Terjadi kesalahan saat menghapus barang",
      error: error.message,
    });
  }
};
