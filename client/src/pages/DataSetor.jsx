import { useEffect, useState } from "react";
import axios from "axios";
import { formatRupiah } from "../functions/util";

const DataSetor = () => {
  const [dataPenjualan, setDataPenjualan] = useState({});

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/admin/get-data-setor`)
      .then((response) => {
        setDataPenjualan(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl text-center font-bold mb-4">Data Setor</h1>
      {Object.keys(dataPenjualan).map((penitip) => (
        <div
          key={penitip}
          className="bg-zinc-100 text-center table-auto rounded-md shadow-lg min-h-[200px] mb-3 p-4"
        >
          <h2 className="text-lg font-semibold my-2">
            {penitip} <br />
            🏦 <span className="font-bold">Total Setoran:</span>{" "}
            {formatRupiah(dataPenjualan[penitip].total_setoran || 0)} <br />✅{" "}
            <span className="font-bold">Total Lunas:</span>{" "}
            {formatRupiah(dataPenjualan[penitip].total_lunas || 0)} <br />❌{" "}
            <span className="font-bold">Total Belum Lunas:</span>{" "}
            {formatRupiah(
              (dataPenjualan[penitip].total_setoran || 0) -
                (dataPenjualan[penitip].total_lunas || 0)
            )}
          </h2>

          {/* Wrapper tabel yang bisa di-scroll */}
          <div className="max-h-60 overflow-auto border rounded-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Nama Barang</th>
                  <th className="border p-2">Jumlah Terjual</th>
                  <th className="border p-2">Total Setor</th>
                  <th className="border p-2">Tanggal Penjualan</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {dataPenjualan[penitip].penjualan.map((item) => (
                  <tr key={item.id} className="text-center">
                    <td className="border p-2">{item.namaBarang}</td>
                    <td className="border p-2">{item.jumlahTerjual}</td>
                    <td className="border p-2">
                      {formatRupiah(item.total_setor)}
                    </td>
                    <td className="border p-2">{item.tanggal}</td>
                    <td
                      className={`border p-2 ${
                        item.status === "Lunas"
                          ? "text-green-600 font-bold"
                          : "text-red-600 font-bold"
                      }`}
                    >
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataSetor;
