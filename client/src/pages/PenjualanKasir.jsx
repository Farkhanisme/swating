import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { formatRupiah } from "../functions/util";

const PenjualanKasir = () => {
  const [penjualan, setPenjualan] = useState([]);
  const [total, setTotal] = useState([]);
  const kategori = moment().format("YY-MM-DD");
  useEffect(() => {
    const getPenjualan = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/get-penjualan`,
          {
            params: { kategori },
          }
        );
        setPenjualan(response.data);
      } catch (error) {
        alert("Gagal mengambil data");
      }
    };

    getPenjualan();
    const getTotal = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-total`, {
          params: { kategori },
        });
        setTotal(response.data);
      } catch (error) {
        alert("Gagal mengambil data");
      }
    };
    getTotal();
  }, []);

  const totalHarga = penjualan.reduce((acc, curr) => acc + curr.totalHarga, 0);

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
            <tr key={index} className="text-center border border-x-0">
              <td>{index + 1}</td>
              <td>
                {moment(penjualan.tanggal).local().format("DDD MMMM, YYYY")}
              </td>
              <td>{penjualan.namaBarang}</td>
              <td>{penjualan.totalTerjual}</td>
              <td>{penjualan.stock}</td>
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
            <tr key={index}>
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

export default PenjualanKasir;
