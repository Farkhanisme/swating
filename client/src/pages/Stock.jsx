import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { formatRupiah } from "../functions/util";
import toast, { Toaster } from "react-hot-toast";

const Stock = () => {
  const [penjualan, setPenjualan] = useState([]);
  useEffect(() => {
    const getPenjualan = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/get-stock`
        );
        setPenjualan(response.data);
      } catch (error) {
        alert("Gagal mengambil data");
      }
    };
    getPenjualan();
  }, []);

  console.log(penjualan);
  

  const updateStock = async (id, newStock) => {
    try {
      console.log(id, newStock);
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/update-stock`,
        { id, stock: newStock }
      );

      
      toast.success(response.data.message);

      // Memperbarui data lokal setelah update
      setPenjualan((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, stock: newStock, updated_at: new Date() }
            : item
        )
      );
    } catch (error) {
      toast.error("Gagal memperbarui stok");
      console.error(error.message);
    }
  };

  return (
    <div className="overflow-y-auto">
      <Toaster />
      <table className="w-full bg-zinc-100 text-center">
        <thead>
          <tr>
            <th>No.</th>
            <th>Re-Stock</th>
            <th>Nama Barang</th>
            <th>Qty</th>
            <th>Stock</th>
            <th>Harga</th>
            <th>Penitip</th>
            <th>Re-Stock</th>
          </tr>
        </thead>
        <tbody>
          {penjualan.map((penjualan, index) => (
            <tr key={index} className="text-center border border-x-0">
              <td>{index + 1}</td>
              <td>
                {moment(penjualan.updated_at).local().format("DD MMMM, YYYY")}
              </td>
              <td>{penjualan.namaBarang}</td>
              <td>{penjualan.totalTerjual}</td>
              <td>
                <input
                  type="text"
                  inputMode="numeric"
                  defaultValue={penjualan.stock}
                  className="border p-1 w-10 text-center"
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setPenjualan((prev) =>
                      prev.map((item) =>
                        item.id === penjualan.id
                          ? { ...item, stock: value }
                          : item
                      )
                    );
                  }}
                />
              </td>
              <td>{formatRupiah(penjualan.totalHarga)}</td>
              <td>{penjualan.nama}</td>
              <td>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  onClick={() => updateStock(penjualan.id, penjualan.stock)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stock;
