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
    tanggal: moment().format("YYYY-MM-DD"), // Default tanggal hari ini
  });

  const [dataPengeluaran, setDataPengeluaran] = useState([]);
  const [editId, setEditId] = useState(null); // ID yang sedang diedit

  const location = useLocation();
  const pathname = location.pathname.startsWith("/admin");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPengeluaran((prev) => ({
      ...prev,
      [name]: name === "nominal" ? formatRupiah(value) : hurufKapital(value),
    }));
  };

  const fetchPengeluaran = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/get-pengeluaran`
      );
      setDataPengeluaran(response.data);
    } catch (error) {
      toast.error("Gagal mengambil data");
    }
  };

  useEffect(() => {
    fetchPengeluaran();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["nominal", "keterangan", "tanggal"];
    const emptyFields = requiredFields.filter((field) => !pengeluaran[field]);

    if (emptyFields.length > 0) {
      toast.error(`Field ${emptyFields.join(", ")} harus diisi!`);
      return;
    }

    const dataKirim = {
      nominal: convertRupiahToNumber(pengeluaran.nominal),
      keterangan: pengeluaran.keterangan,
      tanggal: pengeluaran.tanggal,
    };

    try {
      const loadingToast = toast.loading(
        editId ? "Mengedit data..." : "Menambahkan data..."
      );

      if (editId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/admin/update-pengeluaran/${editId}`,
          dataKirim
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/insert-pengeluaran`,
          dataKirim
        );
      }

      toast.dismiss(loadingToast);
      toast.success(
        editId ? "Data berhasil diperbarui" : "Data berhasil ditambahkan"
      );

      setPengeluaran({
        nominal: "",
        keterangan: "",
        tanggal: moment().format("YYYY-MM-DD"),
      });
      setEditId(null);
      fetchPengeluaran();
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim data");
      console.error("Error submitting data:", error);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setPengeluaran({
      nominal: formatRupiah(item.nominal),
      keterangan: item.keterangan,
      tanggal: item.tanggal,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pengeluaran ini?")) {
      return;
    }

    try {
      const loadingToast = toast.loading("Menghapus data...");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/delete-pengeluaran/${id}`
      );

      toast.dismiss(loadingToast);
      toast.success("Data berhasil dihapus");
      fetchPengeluaran();
    } catch (error) {
      toast.error("Gagal menghapus data");
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="my-10">
      <div className="flex md:space-x-5 flex-col md:flex-row md:space-y-0 space-y-5">
        <input
          name="tanggal"
          type="date"
          value={pengeluaran.tanggal}
          onChange={handleChange}
          className="border-2 border-black rounded-md p-1 text-sm"
        />
        <input
          name="nominal"
          type="text"
          placeholder="Nominal"
          inputMode="numeric"
          value={pengeluaran.nominal}
          onChange={handleChange}
          className="border-2 border-black rounded-md p-1 text-sm"
        />
        <input
          name="keterangan"
          placeholder="Keterangan"
          value={pengeluaran.keterangan}
          onChange={handleChange}
          className="border-2 border-black rounded-md p-1 text-sm"
        />
        <button
          className="bg-green-600 rounded-md p-2 text-white"
          onClick={handleSubmit}
        >
          {editId ? "Update" : "Tambah"}
        </button>
      </div>

      <table className="w-full bg-zinc-100 mt-5 rounded-md shadow-md text-center">
        <thead>
          <tr>
            <th>No.</th>
            <th>Tanggal</th>
            <th>Nominal</th>
            <th>Keterangan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dataPengeluaran.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{moment(item.tanggal).format("DD MMMM, YYYY")}</td>
              <td>{formatRupiah(item.nominal)}</td>
              <td>{item.keterangan}</td>
              <td className="space-x-2">
                <button className="bg-green-600 rounded p-1 text-white" onClick={() => handleEdit(item)}>Edit</button>
                <button className="bg-red-600 rounded p-1 text-white" onClick={() => handleDelete(item.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Pengeluaran;
