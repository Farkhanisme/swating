import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import moment from "moment";

const ExportExcel = ({ data }) => {
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    // **1. Urutkan data berdasarkan tanggal (terkecil ke terbesar)**
    const sortedData = [...data].sort(
      (a, b) => new Date(a.tanggal) - new Date(b.tanggal)
    );

    // **2. Kelompokkan data berdasarkan tanggal**
    const groupedByDate = sortedData.reduce((acc, item) => {
      if (!acc[item.tanggal]) {
        acc[item.tanggal] = [];
      }
      acc[item.tanggal].push(item);
      return acc;
    }, {});

    const worksheetData = [];

    Object.entries(groupedByDate).forEach(([tanggal, items]) => {
      worksheetData.push([{ v: `${tanggal}`, t: "s" }]); // Header tanggal

      // **3. Pisahkan data menjadi "Tembakau" dan "Selain Tembakau"**
      const tembakau = items.filter(
        (item) => item.kategoriBarang.toLowerCase() === "tembakau"
      );
      const selainTembakau = items.filter(
        (item) => item.kategoriBarang.toLowerCase() !== "tembakau"
      );

      if (tembakau.length > 0) {
        worksheetData.push([{ v: "Tembakau", t: "s" }]); // Header kategori
        worksheetData.push([
          "Nama Barang",
          "Nama Penitip",
          "Total Terjual",
          "Total Harga",
          "Status",
        ]);
        tembakau.forEach((row) => {
          worksheetData.push([
            row.namaBarang,
            row.nama || "Tanpa Penitip",
            row.totalTerjual,
            row.totalHarga,
            null,
          ]);
        });

        // Tambahkan total untuk kategori Tembakau
        const totalTembakau = tembakau.reduce(
          (sum, item) => sum + item.totalHarga,
          0
        );
        worksheetData.push([{ v: `Total: ${totalTembakau}`, t: "s" }]);
        worksheetData.push([]); // Baris kosong
      }

      if (selainTembakau.length > 0) {
        worksheetData.push([{ v: "Selain Tembakau", t: "s" }]); // Header kategori
        worksheetData.push([
          "Nama Barang",
          "Nama Penitip",
          "Total Terjual",
          "Total Harga",
          "Status",
        ]);
        selainTembakau.forEach((row) => {
          worksheetData.push([
            row.namaBarang,
            row.nama || "Tanpa Penitip",
            row.totalTerjual,
            row.totalHarga,
            null,
          ]);
        });

        // Tambahkan total untuk kategori Selain Tembakau
        const totalSelainTembakau = selainTembakau.reduce(
          (sum, item) => sum + item.totalHarga,
          0
        );
        worksheetData.push([{ v: `Total: ${totalSelainTembakau}`, t: "s" }]);
        worksheetData.push([]); // Baris kosong
      }
    });

    // **4. Buat worksheet untuk ringkasan penjualan**
    const summaryData = [["Tanggal", "Total Penjualan", "Total Setor", "Laba"]];

    Object.entries(groupedByDate).forEach(([tanggal, items]) => {
      const totalPenjualan = items.reduce(
        (sum, item) => sum + item.totalHarga,
        0
      );
      const totalSetor = items.reduce((sum, item) => sum + item.totalSetor, 0);
      const laba = totalPenjualan - totalSetor;

      summaryData.push([tanggal, totalPenjualan, totalSetor, laba]);
    });

    // Buat worksheet
    const worksheet1 = XLSX.utils.aoa_to_sheet(worksheetData);
    const worksheet2 = XLSX.utils.aoa_to_sheet(summaryData);

    // Buat workbook dan tambahkan kedua worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet1, "Laporan Penjualan");
    XLSX.utils.book_append_sheet(workbook, worksheet2, "Ringkasan Penjualan");

    // Simpan file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    const tanggalSekarang = moment().format("DD-MM-YYYY"); // Format lengkap

    saveAs(dataBlob, `Laporan_Penjualan_${tanggalSekarang}.xlsx`);
  };

  return (
    <button
      onClick={exportToExcel}
      className="md:w-fit w-full p-2 bg-green-500 rounded-md text-white mb-5"
    >
      Export ke Excel
    </button>
  );
};

export default ExportExcel;
