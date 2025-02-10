import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { formatRupiah, hurufKapital } from "../functions/util";

const PenjualanLain = () => {
  const [namaBarang, setNamaBarang] = useState("");
  const [jumlahTerjual, setJumlahTerjual] = useState("");
  const [totalHarga, setTotalHarga] = useState("");
  const [totalSetor, setTotalSetor] = useState("");
  const [penitip, setPenitip] = useState("");
  const [kategoriBarang, setKategoriBarang] = useState("");
  const [tanggal, setTanggal] = useState("");

  const [penjualanLain, setPenjualanLain] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/get-penjualan-lain`
      );
      setPenjualanLain(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/tambah-penjualan-lain`,
        {
          namaBarang,
          jumlahTerjual,
          totalHarga,
          totalSetor,
          penitip,
          kategoriBarang,
          tanggal,
        }
      );

      toast.success("Data berhasil ditambahkan!");
      setNamaBarang("");
      setJumlahTerjual("");
      setTotalHarga("");
      setTotalSetor("");
      setPenitip("");
      setKategoriBarang("");
      setTanggal("");
      fetchData();
    } catch (error) {
      toast.error("Gagal menambahkan data.");
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/delete-penjualan-lain/${id}`
      );
      toast.success("Data berhasil dihapus!");
      fetchData();
    } catch (error) {
      toast.error("Gagal menghapus data.");
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="w-full mx-auto bg-white p-6 rounded-xl shadow-md mb-5">
        <Toaster />
        <h2 className="text-xl font-semibold mb-4">Tambah Penjualan Lain</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nama Barang"
            value={hurufKapital(namaBarang)}
            onChange={(e) => setNamaBarang(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Jumlah Terjual"
            value={jumlahTerjual}
            onChange={(e) => setJumlahTerjual(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Total Harga"
            value={formatRupiah(totalHarga)}
            onChange={(e) => setTotalHarga(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Total Setor"
            value={formatRupiah(totalSetor)}
            onChange={(e) => setTotalSetor(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Penitip"
            value={hurufKapital(penitip)}
            onChange={(e) => setPenitip(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Kategori"
            value={hurufKapital(kategoriBarang)}
            onChange={(e) => setKategoriBarang(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Tambah Data
          </button>
        </form>
      </div>
      <div className="w-full rounded-md shadow-md">
        <table className="w-full bg-zinc-100 rounded-md text-center table-auto shadow-md">
          <thead>
            <tr>
              <th>Nama Barang</th>
              <th>Jumlah Terjual</th>
              <th>Total Harga</th>
              <th>Total Setor</th>
              <th>Penitip</th>
              <th>Kategori</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {penjualanLain.map((item) => (
              <tr key={item.id}>
                <td>{item.namaBarang}</td>
                <td>{item.jumlahTerjual}</td>
                <td>{item.totalHarga}</td>
                <td>{item.totalSetor}</td>
                <td>{item.penitip}</td>
                <td>{item.kategoriBarang}</td>
                <td>{item.tanggal}</td>
                <td>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PenjualanLain;
