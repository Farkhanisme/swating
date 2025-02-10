import { db } from "../database/db.js";

export const getSetor = async (req, res) => {
  db.all(
    `
  SELECT 
      barang.penitipId, 
      penitip.nama,
      penjualan.tanggal,
      SUM(barang.hargaJual * penjualan.jumlahTerjual) AS totalTerjual, 
      SUM(barang.hargaAwal * penjualan.jumlahTerjual) AS totalSetor
  FROM 
      penjualan
  JOIN 
      barang ON penjualan.barangId = barang.id
  LEFT JOIN
      penitip ON barang.penitipId = penitip.id
  WHERE
      penjualan.status != "Lunas"
  GROUP BY 
      barang.penitipId, penjualan.tanggal
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

export const updateStatus = async (req, res) => {
  const {
    barangId,
    penitipId,
    tanggal,
    bulan,
    tanggalMulai,
    tanggalAkhir,
    status,
  } = req.body;

  let query = "UPDATE penjualan SET status = ? WHERE 1=1";
  let params = [status];

  if (barangId) {
    query += " AND barangId = ?";
    params.push(barangId);
  }

  if (penitipId) {
    query += " AND barangId IN (SELECT id FROM barang WHERE penitipId = ?)";
    params.push(penitipId);
  }

  if (tanggal) {
    query += " AND tanggal = ?";
    params.push(tanggal);
  }

  if (bulan) {
    query += " AND strftime('%Y-%m', tanggal) = ?";
    params.push(bulan); // Format: "YYYY-MM"
  }

  if (tanggalMulai && tanggalAkhir) {
    query += " AND tanggal BETWEEN ? AND ?";
    params.push(tanggalMulai, tanggalAkhir);
  }

  db.run(query, params, function (err) {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal memperbarui status", error: err.message });
    }
    res.json({ message: "Status berhasil diperbarui", changes: this.changes });
  });
};

export const updateStatusSetor = async (req, res) => {
  const { barangId, status } = req.body;

  const query = "UPDATE penjualan SET status = ? WHERE barangId = ?";
  const params = [status, barangId];

  db.run(query, params, function (err) {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal memperbarui status", error: err.message });
    }
    res.json({ message: "Status berhasil diperbarui", changes: this.changes });
  });
};

export const getStatusSetor = async (req, res) => {
  const query = `
      SELECT 
        penjualan.id, 
        barang.namaBarang, 
        penitip.nama,
        penjualan.jumlahTerjual, 
        (barang.hargaJual * penjualan.jumlahTerjual) AS totalHarga,
        (barang.hargaAwal * penjualan.jumlahTerjual) AS totalSetor,
        penjualan.status,
        penjualan.barangId,
        penjualan.tanggal
      FROM penjualan
      JOIN barang ON penjualan.barangId = barang.id
      LEFT JOIN 
        penitip ON barang.penitipId = penitip.id
      ORDER BY
        totalSetor DESC
    `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal mengambil data", error: err.message });
    }
    res.json(rows);
  });
};

export const getDataSetor = async (req, res) => {
  const query = `
      SELECT 
        penjualan.id,
        barang.namaBarang,
        penjualan.jumlahTerjual,
        (barang.hargaAwal * penjualan.jumlahTerjual) AS total_setor,
        penitip.nama,
        penjualan.status,
        penjualan.tanggal
      FROM penjualan
      JOIN barang ON penjualan.barangId = barang.id
      JOIN penitip ON barang.penitipId = penitip.id
      ORDER BY 
        CASE 
          WHEN penitip.nama = 'Swating' THEN 999
          ELSE 0 
        END,
      penitip.nama ASC, penjualan.tanggal DESC
    `;

  const totalSetoranQuery = `
      SELECT 
        penitip.nama,
        SUM(barang.hargaAwal * penjualan.jumlahTerjual) AS total_setoran,
        SUM(CASE WHEN penjualan.status = 'Lunas' THEN (barang.hargaAwal * penjualan.jumlahTerjual) ELSE 0 END) AS total_lunas
      FROM penjualan
      JOIN barang ON penjualan.barangId = barang.id
      JOIN penitip ON barang.penitipId = penitip.id
      GROUP BY penitip.nama
    `;

  db.all(query, [], (err, penjualanRows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    db.all(totalSetoranQuery, [], (err, totalSetoranRows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Gabungkan total setoran dan total lunas ke data utama
      const totalSetoranMap = {};
      totalSetoranRows.forEach((row) => {
        totalSetoranMap[row.nama] = {
          total_setoran: row.total_setoran,
          total_lunas: row.total_lunas,
        };
      });

      const groupedData = penjualanRows.reduce((acc, item) => {
        if (!acc[item.nama]) {
          acc[item.nama] = {
            total_setoran: totalSetoranMap[item.nama]?.total_setoran || 0,
            total_lunas: totalSetoranMap[item.nama]?.total_lunas || 0,
            penjualan: [],
          };
        }
        acc[item.nama].penjualan.push(item);
        return acc;
      }, {});

      res.json(groupedData);
    });
  });
};
