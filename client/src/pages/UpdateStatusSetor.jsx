import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatRupiah } from "../functions/util";

const UpdateStatusSetor = () => {
  const [penjualan, setPenjualan] = useState([]);

  // Ambil data penjualan dari backend
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/admin/get-setor-status`)
      .then((response) => setPenjualan(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Fungsi untuk update status berdasarkan barangId
  const updateStatus = async (barangId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/update-status-setor`, {
        barangId: barangId,
        status: "Lunas",
      });
      alert("Status berhasil diperbarui!");

      // Refresh data setelah update
      axios.get(`${import.meta.env.VITE_API_URL}/admin/get-setor-status`)
        .then((response) => setPenjualan(response.data))
        .catch((error) => console.error("Error fetching data:", error));
    } catch (error) {
      console.error("Gagal memperbarui status:", error);
      alert("Gagal memperbarui status.");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white border shadow-md text-center rounded-md">
        <thead className="bg-gray-200">
          <tr>
            <th>No.</th>
            <th>Barang</th>
            <th>Penitip</th>
            <th>Jumlah</th>
            <th>Total Harga</th>
            <th>Total Setor</th>
            <th>Tanggal</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {penjualan.map((item, index) => (
            <tr key={item.id} className="border">
              <td>{index + 1}</td>
              <td>{item.namaBarang}</td>
              <td>{item.nama}</td>
              <td>{item.jumlahTerjual}</td>
              <td>{formatRupiah(item.totalHarga)}</td>
              <td>{formatRupiah(item.totalSetor)}</td>
              <td>{item.tanggal}</td>
              <td>{item.status}</td>
              <td>
                {item.status !== "Lunas" ? (
                  <button
                    onClick={() => updateStatus(item.barangId)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 m-1"
                  >
                    Tandai Lunas
                  </button>
                ) : (
                  <span className="text-green-500">Lunas</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateStatusSetor;