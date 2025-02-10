import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { formatRupiah, hurufKapital } from "../functions/util";

const ReStock = () => {
  const [barangList, setBarangList] = useState([]);
  const [barangId, setBarangId] = useState("");
  const [stock, setStock] = useState("");
  const [hargaBeli, setHargaBeli] = useState("");
  const [tempatBeli, setTempatBeli] = useState("");
  const [tanggalMasuk, setTanggalMasuk] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const fetchBarang = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/get-barang`
      );
      setBarangList(response.data);
    } catch (error) {
      console.error("Error mengambil data barang:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/tambah-stock`, {
        barang_id: barangId,
        stock,
        harga_beli: hargaBeli,
        tempat: tempatBeli,
        tanggal_masuk: tanggalMasuk,
      });

      toast.success("Stok berhasil ditambahkan!");
      fetchBarang();
    } catch (error) {
      toast.error("Gagal menambahkan stok. Coba lagi.");
      console.error("Error:", error);
    }
  };

  const [stokData, setStokData] = useState([]);

  useEffect(() => {
    fetchStok();
    fetchBarang();
  }, []);

  const fetchStok = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/get-all-stock`
      );
      setStokData(response.data.stock);
    } catch (error) {
      console.error("Gagal mengambil data stok:", error);
    }
  };

  const handleUpdate = async (id, stock, tanggalMasuk, hargaBeli, tempat) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/update-stock/${id}`,
        {
          stock,
          tanggal_masuk: tanggalMasuk,
          harga_beli: hargaBeli,
          tempat: tempat,
        }
      );
      fetchBarang();
      fetchStok();
    } catch (error) {
      console.error("Gagal memperbarui stok:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus stok ini?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/delete-stock/${id}`
      );
      fetchBarang();
      fetchStok();
    } catch (error) {
      console.error("Gagal menghapus stok:", error);
    }
  };

  return (
    <>
      <div className="w-full mx-auto bg-white p-6 rounded-xl shadow-md">
        <Toaster />
        <h2 className="text-xl font-semibold mb-4">Tambah Stok Barang</h2>
        <form onSubmit={handleSubmit} className="gap-4 flex flex-row">
          {/* Pilih Barang */}
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block text-gray-700">Barang</label>
            <select
              value={barangId}
              onChange={(e) => setBarangId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Barang</option>
              {barangList.map((barang) => (
                <option key={barang.id} value={barang.id}>
                  {barang.namaBarang}
                </option>
              ))}
            </select>

            <label className="block text-gray-700">Jumlah Stok</label>
            <input
              type="text"
              inputMode="numeric"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full p-2 border rounded"
              required
              min="1"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">
            <label className="block text-gray-700">Harga Beli</label>
            <input
              type="text"
              value={hargaBeli}
              onChange={(e) => setHargaBeli(formatRupiah(e.target.value))}
              className="w-full p-2 border rounded"
              required
            />
            <label className="block text-gray-700">Tempat Beli</label>
            <input
              type="text"
              value={tempatBeli}
              onChange={(e) => setTempatBeli(hurufKapital(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Pilih Tanggal Masuk */}
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block text-gray-700">Tanggal Masuk</label>
            <input
              type="date"
              value={tanggalMasuk}
              onChange={(e) => setTanggalMasuk(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />

            {/* Tombol Submit */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Tambah Stok"}
            </button>
          </div>
        </form>
      </div>
      <div className="w-full mx-auto bg-white rounded-xl shadow-md overflow-x-auto my-5">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">No</th>
              <th className="border p-2">Nama Barang</th>
              <th className="border p-2">Stok</th>
              <th className="border p-2">Tanggal Masuk</th>
              <th className="border p-2">Harga Beli</th>
              <th className="border p-2">Tempat Beli</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {stokData.map((stok, index) => (
              <tr key={stok.id} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{stok.namaBarang}</td>

                {/* Input Edit Stok */}
                <td className="border p-2">
                  <input
                    type="text"
                    className="w-fit p-1 border rounded text-center"
                    defaultValue={stok.stock}
                    onBlur={(e) =>
                      handleUpdate(
                        stok.id,
                        e.target.value,
                        stok.tanggal_masuk,
                        stok.harga_beli,
                        stok.tempat
                      )
                    }
                  />
                </td>

                {/* Input Edit Tanggal */}
                <td className="border p-2">
                  <input
                    type="date"
                    className="w-fit p-1 border rounded text-center"
                    defaultValue={stok.tanggal_masuk}
                    onBlur={(e) =>
                      handleUpdate(
                        stok.id,
                        e.target.value,
                        stok.tanggal_masuk,
                        stok.harga_beli,
                        stok.tempat
                      )
                    }
                  />
                </td>

                <td className="border p-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-fit p-1 border rounded text-center"
                    defaultValue={formatRupiah(stok.harga_beli)}
                    onBlur={(e) =>
                      handleUpdate(
                        stok.id,
                        stok.stock,
                        stok.tanggal_masuk,
                        e.target.value,
                        stok.tempat
                      )
                    }
                  />
                </td>

                <td className="border p-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-fit p-1 border rounded text-center"
                    defaultValue={stok.tempat}
                    onBlur={(e) =>
                      handleUpdate(
                        stok.id,
                        stok.stock,
                        stok.tanggal_masuk,
                        stok.harga_beli,
                        e.target.value
                      )
                    }
                  />
                </td>

                {/* Tombol Hapus */}
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(stok.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}

            {stokData.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Tidak ada data stok
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ReStock;
