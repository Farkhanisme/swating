import { query } from "../database/db.js";

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
  const { kategori } = req.query;
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
  WHERE 
      penjualan.tanggal = ? OR ? = ''
  GROUP BY 
      barang.namaBarang, penitip.nama, barang.stock, penjualan.tanggal
  ORDER BY 
      penjualan.tanggal DESC
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

export const getTotal = async (req, res) => {
  const { kategori } = req.query;
  const select = `SELECT tanggal, SUM(totalHarga) AS totalTerjual FROM penjualan WHERE tanggal = ? OR ? = '' GROUP BY tanggal ORDER BY tanggal DESC;`;
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

export const getPengeluaran = async (req, res) => {
  const select = `SELECT * FROM pengeluaran ORDER BY tanggal DESC;`;
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

      await query(insertBarang, [barangId, jumlahTerjual, totalHarga, totalSetor]);
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

export const insertPengeluaran = async (req, res) => {
  const { nominal, keterangan } = req.body;

  const insert = "INSERT INTO pengeluaran (nominal, keterangan, tanggal) VALUES (?, ?, CURDATE())";

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
