import { getConnection, query } from "../database/db.js";

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
  const connection = await getConnection();

  try {
    // Validasi input
    if (!Array.isArray(req.body.data)) {
      return res.status(400).json({
        success: false,
        message: "Format data tidak valid",
      });
    }

    await connection.beginTransaction();

    const insertPenjualan = `
      INSERT INTO penjualan 
        (barangId, jumlahTerjual, totalHarga, totalSetor, tanggal) 
      VALUES 
        (?, ?, ?, ?, CURDATE())
    `;

    const checkStock = `
      SELECT stock, namaBarang 
      FROM barang 
      WHERE id = ?
    `;

    const updateStock = `
      UPDATE barang 
      SET stock = stock - ?, 
          updated_at = CURDATE() 
      WHERE id = ?
    `;

    for (const item of req.body.data) {
      const { barangId, jumlahTerjual, totalHarga, totalSetor } = item;

      // Validasi data item
      if (
        !barangId ||
        !jumlahTerjual ||
        !totalHarga ||
        isNaN(jumlahTerjual) ||
        isNaN(totalHarga) ||
        jumlahTerjual <= 0 ||
        totalHarga < 0
      ) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Data tidak valid untuk barang ID: ${barangId}`,
        });
      }

      // Cek stok
      const [stockResult] = await query(checkStock, [barangId]);
      if (!stockResult || stockResult.stock < jumlahTerjual) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Stok tidak mencukupi untuk ${
            stockResult?.namaBarang || "barang yang dipilih"
          }`,
        });
      }

      // Insert penjualan
      await query(insertPenjualan, [
        barangId,
        jumlahTerjual,
        totalHarga,
        totalSetor,
      ]);

      // Update stok
      await query(updateStock, [jumlahTerjual, barangId]);
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Transaksi berhasil dilakukan",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error dalam proses checkout:", error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memproses transaksi",
      error: error.message,
    });
  } finally {
    connection.release();
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
