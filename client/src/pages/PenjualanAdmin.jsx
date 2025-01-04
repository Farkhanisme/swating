import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { formatRupiah } from "../functions/util";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PenjualanAdmin = () => {
  const [penjualan, setPenjualan] = useState([]);
  const [total, setTotal] = useState([]);
  const [allTotal, setAllTotal] = useState([]);
  const [setor, setSetor] = useState([]);

  useEffect(() => {
    const getPenjualan = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/get-penjualan`
        );
        setPenjualan(response.data);
      } catch (error) {
        alert("Gagal mengambil data");
      }
    };

    getPenjualan();
    const getTotal = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/get-total`
        );
        setTotal(response.data);
      } catch (error) {
        alert("Gagal mengambil data");
      }
    };
    getTotal();

    const getAllTotal = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/get-all-total`
        );
        setAllTotal(response.data);
      } catch (error) {
        alert("Gagal mengambil data");
      }
    };
    getAllTotal();

    const getSetor = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/get-setor`
        );
        setSetor(response.data);
      } catch (error) {
        alert("Gagal mengambil data");
      }
    };
    getSetor();
  }, []);

  const handleGeneratePDF = () => {
    try {
      const pdf = new jsPDF();

      // Tambahkan Judul
      pdf.text("Laporan Penjualan", 14, 10);

      // Tambahkan Tabel Penjualan
      pdf.autoTable({
        startY: 20,
        head: [["No.", "Tanggal", "Nama Barang", "Qty", "Harga"]],
        body: penjualan.map((item, index) => [
          index + 1,
          moment(item.tanggal).format("DD MMMM YYYY"),
          item.namaBarang,
          item.totalTerjual,
          formatRupiah(item.totalHarga),
        ]),
      });

      // Simpan PDF
      pdf.save("laporan_penjualan.pdf");

      alert("PDF berhasil diunduh!");
    } catch (error) {
      console.error("Error saat membuat PDF:", error);
      alert("Terjadi kesalahan saat membuat PDF.");
    }
  };

  return (
    <>
      <button className="md:w-fit w-full p-2 bg-green-500 rounded-md text-white mb-5" onClick={handleGeneratePDF}>
        Generate PDF dan Kirim ke WhatsApp
      </button>
      <div className="flex flex-col-reverse md:flex-row mb-5">
        <table className="w-full bg-zinc-100 text-center">
          <thead>
            <tr>
              <th>No.</th>
              <th>Tanggal</th>
              <th>Nama Barang</th>
              <th>Qty</th>
              <th>Sisa</th>
              <th>Harga</th>
              <th>Penitip</th>
            </tr>
          </thead>
          <tbody>
            {penjualan.map((penjualan, index) => (
              <tr key={index} className="text-center border border-x-0">
                <td>{index + 1}</td>
                <td>
                  {moment(penjualan.tanggal).local().format("DDD MMMM, YYYY")}
                </td>
                <td>{penjualan.namaBarang}</td>
                <td>{penjualan.totalTerjual}</td>
                <td>{penjualan.stock - penjualan.totalTerjual}</td>
                <td>{formatRupiah(penjualan.totalHarga)}</td>
                <td>{penjualan.nama}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex md:flex-row flex-col md:space-y-0 space-y-5">
        <div className="flex flex-col md:w-1/2 w-full space-y-2">
          <table className="bg-zinc-100 text-center table-auto">
            <thead>
              <tr>
                <th>Pendapatan</th>
                <th>Setor</th>
                <th>Laba</th>
              </tr>
            </thead>
            <tbody>
              {allTotal.map((allTotal, index) => (
                <tr key={index}>
                  <td className="text-center border border-x-0">
                    {formatRupiah(allTotal.totalTerjual)}
                  </td>
                  <td className="text-center border border-x-0">
                    {formatRupiah(allTotal.totalSetor)}
                  </td>
                  <td className="text-center border border-x-0">
                    {formatRupiah(allTotal.totalTerjual - allTotal.totalSetor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="bg-zinc-100 text-center">
            <thead>
              <tr>
                <th>No.</th>
                <th>Tanggal</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {total.map((total, index) => (
                <tr key={index} className="text-center border border-x-0">
                  <td>{index + 1}</td>
                  <td>{moment(total.tanggal).format("DDD MMMM, YYYY")}</td>
                  <td>{formatRupiah(total.totalTerjual)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <table className="bg-zinc-100 text-center md:w-1/2 table-auto">
          <thead>
            <tr>
              <th>Setor</th>
              <th>Penitip</th>
            </tr>
          </thead>
          <tbody>
            {setor.map((setor, index) => (
              <tr key={index}>
                <td className="text-center border border-x-0">
                  {formatRupiah(setor.totalSetor)}
                </td>
                <td className="text-center border border-x-0">{setor.nama}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PenjualanAdmin;
