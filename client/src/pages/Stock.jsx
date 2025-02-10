import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

const StokBarang = () => {
  const [stokData, setStokData] = useState([]);
  const [terjualData, setTerjualData] = useState([]);
  const stokTableRef = useRef(null);
  const terjualTableRef = useRef(null);

  useEffect(() => {
    const getPenjualan = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/get-stock`
        );
        setStokData(response.data.stok);
        setTerjualData(response.data.terjual);
      } catch (error) {
        alert(error);
      }
    };
    getPenjualan();
  }, []);

  if (stokData.length === 0 || terjualData.length === 0)
    return <p className="text-center mt-5">Loading...</p>;

  const stokColumns = Object.keys(stokData[0]);
  const terjualColumns = Object.keys(terjualData[0]);

  console.log(terjualColumns);
  

  // Fungsi untuk sinkronisasi scroll
  const syncScroll = (e, ref) => {
    if (ref.current) ref.current.scrollLeft = e.target.scrollLeft;
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex space-x-4">
        {/* Tabel Stok */}
        <div
          className="overflow-x-auto w-1/2"
          ref={stokTableRef}
          onScroll={(e) => syncScroll(e, terjualTableRef)}
        >
          <h2 className="text-lg font-semibold text-center my-2">
            Stok Barang
          </h2>
          <table className="min-w-max border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                {stokColumns.map((col, index) => (
                  <th
                    key={col}
                    className={`p-2 border border-gray-300 ${
                      index === 0 ? "sticky left-0 bg-white" : ""
                    }`}
                  >
                    {col === "namaBarang" ? "Nama Barang" : col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stokData.map((row, index) => (
                <tr key={index} className="odd:bg-gray-100">
                  {stokColumns.map((col, colIndex) => (
                    <td
                      key={col}
                      className={`p-2 border border-gray-300 text-center ${
                        colIndex === 0 ? "sticky left-0 bg-white" : ""
                      }`}
                    >
                      {row[col] || 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabel Terjual */}
        <div
          className="overflow-x-auto w-1/2"
          ref={terjualTableRef}
          onScroll={(e) => syncScroll(e, stokTableRef)}
        >
          <h2 className="text-lg font-semibold text-center my-2">
            Barang Terjual
          </h2>
          <table className="min-w-max border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                {terjualColumns.map((col, index) => (
                  <th
                    key={col}
                    className={`p-2 border border-gray-300 ${
                      index === 0 ? "sticky left-0 bg-white" : ""
                    }`}
                  >
                    {col === "barang_id" ? "ID Barang" : col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {terjualData.map((row, index) => (
                <tr key={index} className="odd:bg-gray-100">
                  {terjualColumns.map((col, colIndex) => (
                    <td
                      key={col}
                      className={`p-2 border border-gray-300 text-center ${
                        colIndex === 0 ? "sticky left-0 bg-white" : ""
                      }`}
                    >
                      {row[col] || 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StokBarang;
