import React, { useEffect, useState } from "react";
import {
  convertRupiahToNumber,
  formatRupiah,
  hurufKapital,
} from "../functions/util";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import moment from "moment";

const Pengeluaran = () => {
  const [pengeluaran, setPengeluaran] = useState({
    nominal: "",
    keterangan: "",
  });

  const [dataPengeluaran, setDataPengeluaran] = useState([]);

  const location = useLocation();

  const pathname = location.pathname.startsWith("/admin");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPengeluaran((prev) => ({ ...prev, [name]: hurufKapital(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["nominal", "keterangan"];
    const emptyFields = requiredFields.filter((field) => !pengeluaran[field]);

    if (emptyFields.length > 0) {
      toast.error(`Field ${emptyFields.join(", ")} harus diisi!`);
      return;
    }

    const dataKirim = {
      nominal: convertRupiahToNumber(pengeluaran.nominal),
      keterangan: pengeluaran.keterangan,
    };

    try {
      const loadingToast = toast.loading("Menambahkan barang...");

      const response = "";

      if (pathname) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/insert-pengeluaran`,
          dataKirim
        );
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/insert-pengeluaran`,
          dataKirim
        );
      }

      toast.dismiss(loadingToast);
      toast.success("Barang berhasil ditambahkan");

      setPengeluaran({
        nominal: "",
        keterangan: "",
      });
    } catch (error) {
      let errorMessage = "Terjadi kesalahan";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = "URL tidak ditemukan";
      } else if (error.request) {
        errorMessage = "Server tidak merespon";
      }

      toast.error(errorMessage);
      console.error("Error submitting data:", error);
    }
  };

  useEffect(() => {
    const getPengeluaran = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/get-pengeluaran`
        );
        setDataPengeluaran(response.data);
      } catch (error) {
        toast.error("Gagal mengambil data");
      }
    };
    getPengeluaran();
  }, []);

  return (
    <>
      <div className="flex md:space-x-5 flex-col md:flex-row md:space-y-0 space-y-5">
        <div className="w-full md:w-1/2 flex space-y-2 md:space-x-5 items-start flex-col md:flex-row md:items-center">
          <label>Nominal: </label>
          <input
            name="nominal"
            value={formatRupiah(pengeluaran.nominal)}
            onChange={handleChange}
            className="w-full border-2 border-black rounded-md p-1 placeholder-gray-500 text-sm"
          />
        </div>
        <div className="w-full md:w-1/2 flex space-y-2 md:space-x-5 items-start flex-col md:flex-row md:items-center">
          <label>Keterangan: </label>
          <input
            name="keterangan"
            value={pengeluaran.keterangan}
            onChange={handleChange}
            className="w-full border-2 border-black rounded-md p-1 placeholder-gray-500 text-sm"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 rounded-md p-2 text-white float-end"
          onClick={handleSubmit}
        >
          Send
        </button>
      </div>
      <table className="w-full bg-zinc-100 mt-5">
        <thead>
          <tr>
            <th>No.</th>
            <th>Tanggal</th>
            <th>Nominal</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {dataPengeluaran.map((dataPengeluaran, index) => (
            <tr
              key={dataPengeluaran.id}
              className="text-center border border-x-0"
            >
              <td>{index + 1}</td>
              <td>
                {moment(dataPengeluaran.tanggal).format("DD MMMM, YYYY")}
              </td>
              <td>{formatRupiah(dataPengeluaran.nominal)}</td>
              <td>{dataPengeluaran.keterangan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Pengeluaran;
