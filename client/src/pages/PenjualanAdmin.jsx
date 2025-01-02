import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { formatRupiah } from "../functions/util";

const PenjualanAdmin = () => {
  const [penjualan, setPenjualan] = useState([]);
  const [total, setTotal] = useState([]);

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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/get-total`);
        setTotal(response.data);
      } catch (error) {
        alert("Gagal mengambil data");
      }
    };
    getTotal();
  }, []);

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <table className="w-full bg-zinc-100 text-center">
        <thead>
          <tr>
            <th>No.</th>
            <th>Tanggal</th>
            <th>Nama Barang</th>
            <th>Quantity</th>
            <th>Sisa</th>
            <th>Total terjual</th>
            <th>Penitip</th>
          </tr>
        </thead>
        <tbody>
          {penjualan.map((penjualan, index) => (
            <tr key={penjualan.id} className="text-center border border-x-0">
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
      <table className="md:w-2/6 w-full bg-zinc-100 text-center">
        <thead>
          <tr>
            {/* <th>No.</th> */}
            <th>Tanggal</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {total.map((total, index) => (
            <tr>
              {/* <td>{index + 1}</td> */}
              <td>{moment(total.tanggal).format("DDD MMMM, YYYY")}</td>
              <td>{formatRupiah(total.totalTerjual)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PenjualanAdmin;
