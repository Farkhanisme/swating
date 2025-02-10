import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { formatRupiah } from "../functions/util";
import jsPDF from "jspdf";
import "jspdf-autotable";
import toast, { Toaster } from "react-hot-toast";
import ExportExcel from "../components/ExportExcel";

const PenjualanAdmin = () => {
  const [penjualan, setPenjualan] = useState([]);
  const [total, setTotal] = useState([]);
  const [allTotal, setAllTotal] = useState([]);
  const [setor, setSetor] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getPenjualan = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/get-penjualan`
        );
        setPenjualan(response.data);
      } catch (error) {
        toast.error("Gagal mengambil data");
      } finally {
        setIsLoading(false);
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
        toast.error("Gagal mengambil data");
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
        toast.error("Gagal mengambil data");
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
        toast.error("Gagal mengambil data");
      }
    };
    getSetor();
  }, [isLoading]);

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

      pdf.autoTable({
        startY: pdf.lastAutoTable.finalY + 10, // Mulai setelah tabel sebelumnya
        head: [["No.", "Pendapatan", "Setor", "Laba"]],
        body: allTotal.map((allTotal, index) => [
          index + 1,
          formatRupiah(allTotal.totalTerjual),
          formatRupiah(allTotal.totalSetor),
          formatRupiah(allTotal.totalTerjual - allTotal.totalSetor),
        ]),
      });

      // Simpan PDF
      pdf.save(`laporan_penjualan_${moment().format("DD-MM-YY")}.pdf`);

      toast.success("PDF berhasil diunduh!");
    } catch (error) {
      console.error("Error saat membuat PDF:", error);
      alert("Terjadi kesalahan saat membuat PDF.");
    }
  };

  const handleRefresh = (e) => {
    e.preventDefault();
    setIsLoading(true);
  };

  const groupedPenjualan = penjualan.reduce((acc, item) => {
    const tanggal = moment(item.tanggal).format("YYYY-MM-DD");

    if (!acc[tanggal]) {
      acc[tanggal] = [];
    }

    acc[tanggal].push(item);

    return acc;
  }, {});

  const groupedSetor = setor.reduce((acc, item) => {
    const tanggal = moment(item.tanggal).format("YYYY-MM-DD");

    if (!acc[tanggal]) {
      acc[tanggal] = [];
    }

    acc[tanggal].push(item);

    return acc;
  }, {});

  // Konversi objek hasil reduce menjadi array
  const groupedArray = Object.values(groupedPenjualan);
  const groupedArraySetor = Object.values(groupedSetor);

  return (
    <div className="h-full">
      <Toaster />
      <div className="flex space-x-5 flex-row">
        <button
          className="md:w-fit w-full p-2 bg-green-500 rounded-md text-white mb-5"
          onClick={handleGeneratePDF}
        >
          Download Laporan Penjualan
        </button>
        <button
          className="md:w-fit w-full p-2 bg-green-500 rounded-md text-white mb-5"
          onClick={handleRefresh}
        >
          Refresh
        </button>
        <ExportExcel data={penjualan} />
      </div>
      <div className="flex flex-row space-x-5 mb-5 h-2/5">
        <div className="flex flex-col w-1/2 overflow-x-scroll space-y-2 rounded-md shadow-md">
          <table className="bg-zinc-100 text-center table-auto rounded-md shadow-md">
            <thead>
              <tr>
                <th>Bulan</th>
                <th>Pendapatan</th>
                <th>Setor</th>
                <th>Laba</th>
              </tr>
            </thead>
            <tbody>
              {allTotal.map((allTotal, index) => (
                <tr key={index}>
                  <td className="text-center border border-x-0">
                    {moment(allTotal.bulan).format("MMMM YYYY")}
                  </td>
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
          <table className="bg-zinc-100 text-center rounded-md shadow-md">
            <thead>
              <tr>
                <th>No.</th>
                <th>Tanggal</th>
                <th>Total</th>
                <th>Total Setor</th>
                <th>Laba</th>
              </tr>
            </thead>
            <tbody>
              {total.map((total, index) => (
                <tr key={index} className="text-center border border-x-0">
                  <td>{index + 1}</td>
                  <td>{moment(total.tanggal).format("DD MMMM, YYYY")}</td>
                  <td className="text-left">
                    {formatRupiah(total.totalTerjual)}
                  </td>
                  <td className="text-left">
                    {formatRupiah(total.totalSetor)}
                  </td>
                  <td className="text-left">
                    {formatRupiah(total.totalTerjual - total.totalSetor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-scroll w-1/2 rounded-md shadow-md">
          <table className="bg-zinc-100 text-center w-full table-auto rounded-md shadow-md">
            <tbody>
              {groupedArraySetor.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  {/* Menampilkan tanggal grup */}
                  <tr className="bg-gray-200 font-semibold text-xl">
                    <td colSpan="7" className="p-2">
                      {moment(group[0].tanggal).format("DD MMMM, YYYY")}
                    </td>
                  </tr>
                  <tr>
                    <th>Setor</th>
                    <th>Penitip</th>
                    <th>Tanggal</th>
                  </tr>

                  {/* Menampilkan data setiap penjualan dalam grup */}
                  {group.map((setor, index) => (
                    <tr key={index}>
                      <td className="text-center border border-x-0">
                        {formatRupiah(setor.totalSetor)}
                      </td>
                      <td className="text-center border border-x-0">
                        {setor.nama}
                      </td>
                      <td className="text-center border border-x-0">
                        {moment(setor.tanggal).format("DD MMMM, YYYY")}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="h-[45%] overflow-x-scroll rounded-md shadow-md">
        <table className="w-full bg-zinc-100 text-center rounded-md shadow-md">
          <tbody>
            {groupedArray.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {/* Menampilkan tanggal grup */}
                <tr className="bg-gray-200 font-semibold text-xl">
                  <td colSpan="7" className="p-2">
                    {moment(group[0].tanggal).format("DD MMMM, YYYY")}
                  </td>
                </tr>
                <tr>
                  <th>No.</th>
                  <th>Tanggal</th>
                  <th>Nama Barang</th>
                  <th>Qty</th>
                  <th>Sisa</th>
                  <th>Harga</th>
                  <th>Penitip</th>
                </tr>

                {/* Menampilkan data setiap penjualan dalam grup */}
                {group.map((penjualan, index) => (
                  <tr key={index} className="text-center border border-x-0">
                    <td>{index + 1}</td>
                    <td>
                      {moment(penjualan.tanggal)
                        .local()
                        .format("DD MMMM, YYYY")}
                    </td>
                    <td>{penjualan.namaBarang}</td>
                    <td>{penjualan.totalTerjual}</td>
                    <td>{penjualan.stock != null ? penjualan.stock : "♾️"}</td>
                    <td>{formatRupiah(penjualan.totalHarga)}</td>
                    <td>{penjualan.penitip}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PenjualanAdmin;
