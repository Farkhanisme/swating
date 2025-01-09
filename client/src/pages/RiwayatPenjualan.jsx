import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { formatRupiah } from "../functions/util";

const RiwayatPenjualan = () => {
  const [penjualan, setPenjualan] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getPenjualan = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/get-riwayat-penjualan`
        );
        setPenjualan(response.data);
      } catch (error) {
        toast.error("Gagal mengambil data");
      } finally {
        setIsLoading(false);
      }
    };
    getPenjualan();
  }, [isLoading]);

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
        setIsLoading(true);
      }
    } catch (error) {
      toast.error("Gagal menghapus Riwayat");
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <Toaster />
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
            <th>Aksi</th>
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
