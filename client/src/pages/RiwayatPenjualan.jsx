import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { formatRupiah } from "../functions/util";

const RiwayatPenjualan = () => {
  const [penjualan, setPenjualan] = useState([]);
  const [filteredPenjualan, setFilteredPenjualan] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Ambil data penjualan
  const getPenjualan = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/get-riwayat-penjualan`
      );
      setPenjualan(response.data);
      setFilteredPenjualan(response.data); // Set data awal
    } catch (error) {
      toast.error("Gagal mengambil data");
    }
  };

  useEffect(() => {
    getPenjualan();
  }, []);

  // Hapus riwayat penjualan
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus Riwayat ini?")) {
      return;
    }

    try {
      const loadingToast = toast.loading("Menghapus Riwayat...");

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/delete-riwayat-penjualan/${id}`
      );

      if (response) {
        toast.dismiss(loadingToast);
        toast.success("Riwayat berhasil dihapus");
        getPenjualan();
      }
    } catch (error) {
      toast.error("Gagal menghapus Riwayat");
      console.error("Error deleting item:", error);
    }
  };

  // Fungsi pencarian
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    applyFilters(query, startDate, endDate);
  };

  // Fungsi filter berdasarkan tanggal
  const handleDateFilter = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    applyFilters(searchQuery, start, end);
  };

  // Gabungkan pencarian dan filter tanggal
  const applyFilters = (query, start, end) => {
    let filteredData = penjualan;

    // Filter berdasarkan pencarian
    if (query) {
      filteredData = filteredData.filter(
        (item) =>
          item.namaBarang.toLowerCase().includes(query) ||
          item.nama.toLowerCase().includes(query) ||
          moment(item.tanggal).format("DD MMMM, YYYY").includes(query)
      );
    }

    // Filter berdasarkan tanggal
    if (start && end) {
      filteredData = filteredData.filter((item) => {
        const itemDate = moment(item.tanggal).format("YYYY-MM-DD");
        return itemDate >= start && itemDate <= end;
      });
    }

    if (start) {
      filteredData = filteredData.filter((item) => {
        const itemDate = moment(item.tanggal).format("YYYY-MM-DD");
        return itemDate == start;
      });
    }

    setFilteredPenjualan(filteredData);
  };

  const inputRef = useRef(null);

  const delSearch = () => {
    setSearchQuery("");
    setFilteredPenjualan(penjualan);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="overflow-x-auto my-10">
      <Toaster />

      {/* Input Pencarian dan Filter Tanggal */}
      <div className="mb-4 space-y-4">
        {/* Filter Tanggal */}
        <div className="flex space-x-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateFilter(e.target.value, endDate)}
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleDateFilter(startDate, e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
              applyFilters(searchQuery, "", "");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Reset
          </button>
        </div>
        {/* Input Pencarian */}
        <div className="w-full space-x-3 flex">
          <input
            type="text"
            ref={inputRef}
            placeholder="Cari nama barang, penitip, atau tanggal..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded-md"
          />

          <button
            onClick={delSearch}
            className="bg-red-500 h-10 w-10 text-white rounded mr-2"
          >
            x
          </button>
        </div>
      </div>

      {/* Tabel Riwayat Penjualan */}
      <table className="w-full bg-zinc-100 text-center rounded-md shadow-md">
        <thead>
          <tr>
            <th>No.</th>
            <th>Tanggal</th>
            <th>Nama Barang</th>
            <th>Qty</th>
            <th>Sisa</th>
            <th>Harga</th>
            <th>Penitip</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredPenjualan.map((penjualan, index) => (
            <tr key={index} className="text-center border border-x-0">
              <td>{index + 1}</td>
              <td>
                {moment(penjualan.tanggal).local().format("DD MMMM, YYYY")}
              </td>
              <td>{penjualan.namaBarang}</td>
              <td>{penjualan.jumlahTerjual}</td>
              <td>{penjualan.stock != null ? penjualan.stock : "♾️"}</td>
              <td>{formatRupiah(penjualan.totalHarga)}</td>
              <td>{penjualan.nama}</td>
              <td>
                <button
                  className="bg-red-500 text-white text-sm text-center p-1 rounded-sm"
                  onClick={() => handleDelete(penjualan.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiwayatPenjualan;
