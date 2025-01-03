import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  convertRupiahToNumber,
  formatRupiah,
  hurufKapital,
} from "../functions/util";

const TambahBarang = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [penitip, setPenitip] = useState([]);
  const [barang, setBarang] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    namaBarang: "",
    kategoriBarang: "",
    kodeProduk: "",
    hargaAwal: "",
    hargaJual: "",
    stock: "",
    penitipId: "",
  });

  const [dataBarang, setDataBarang] = useState({
    namaBarang: "",
    kategoriBarang: "",
    penitip: "",
    penitipId: "",
    penitipKode: "",
    hargaAwal: "",
    hargaJual: "",
    stock: "",
    kodeProduk: "",
  });

  const [dataPenitip, setDataPenitip] = useState({
    namaPenitip: "",
    kodePenitip: "",
  });

  const handleBarangChange = (e) => {
    const { name, value } = e.target;

    if (name === "penitip") {
      const selectedPenitip = penitip.find((pen) => pen.nama === value);
      setDataBarang((prev) => ({
        ...prev,
        penitip: hurufKapital(value),
        penitipId: selectedPenitip.id,
        penitipKode: selectedPenitip.kode,
      }));
    } else {
      setDataBarang((prev) => ({ ...prev, [name]: hurufKapital(value) }));
    }
  };

  const handlePenitipChange = (e) => {
    const { name, value } = e.target;
    setDataPenitip((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (dataBarang.namaBarang) {
      const code = generateProductCode(
        dataBarang.namaBarang,
        dataBarang.penitipKode
      );
      setDataBarang((prev) => ({ ...prev, kodeProduk: code }));
    } else {
      setDataBarang((prev) => ({ ...prev, kodeProduk: "" }));
    }
  }, [dataBarang.namaBarang, dataBarang.penitip]);

  const generateProductCode = (namaBarang, penitip) => {
    const nameCode = namaBarang
      .split(" ")
      .map((word) => word.substring(0, 1).toUpperCase())
      .join("");

    const randomDigits = Math.floor(1000 + Math.random() * 9000);

    if (!penitip) return `${nameCode}-${randomDigits}`;

    const kodePenitip = penitip;

    return `${nameCode}-${randomDigits}-${kodePenitip}`;
  };

  const handleBarangSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "namaBarang",
      "kategoriBarang",
      "hargaAwal",
      "stock",
    ];
    const emptyFields = requiredFields.filter((field) => !dataBarang[field]);

    if (emptyFields.length > 0) {
      toast.error(`Field ${emptyFields.join(", ")} harus diisi!`);
      return;
    }

    const dataBarangKirim = {
      namaBarang: dataBarang.namaBarang,
      kategoriBarang: dataBarang.kategoriBarang,
      penitipId: dataBarang.penitipId,
      hargaAwal: convertRupiahToNumber(dataBarang.hargaAwal),
      hargaJual: convertRupiahToNumber(dataBarang.hargaJual),
      stock: dataBarang.stock,
      kodeProduk: dataBarang.kodeProduk,
    };

    try {
      const loadingToast = toast.loading("Menambahkan barang...");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/insert-barang`,
        dataBarangKirim
      );

      if (response) {
        toast.dismiss(loadingToast);
        toast.success("Barang berhasil ditambahkan");
      }

      setDataBarang({
        namaBarang: "",
        kategoriBarang: "",
        kodeProduk: "",
        hargaAwal: "",
        hargaJual: "",
        stock: "",
        penitip: "",
        penitipId: "",
      });

      setIsLoading(true);
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

  const handlePenitipSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ["namaPenitip", "kodePenitip"];
    const emptyFields = requiredFields.filter((field) => !dataPenitip[field]);

    if (emptyFields.length > 0) {
      toast.error(`Field ${emptyFields.join(", ")} harus diisi!`);
      return;
    }

    const data = {
      namaPenitip: dataPenitip.namaPenitip,
      kodePenitip: dataPenitip.kodePenitip,
    };
    try {
      const loadingToast = toast.loading("Menambahkan penitip...");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/insert-penitip`,
        data
      );

      toast.dismiss(loadingToast);
      toast.success("Penitip berhasil ditambahkan");

      setIsLoading(true);

      setDataPenitip({
        namaPenitip: "",
        kodePenitip: "",
      });
    } catch (error) {
      toast.error("Data gagal ditambahkan");
    }
  };

  useEffect(() => {
    const getPenitip = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/get-penitip`
        );
        setPenitip(response.data);
      } catch (error) {
        toast.error("Gagal mengambil data");
      } finally {
        setIsLoading(false);
      }
    };

    const getBarang = async () => {
      const kategori = "";
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/get-barang`,
          {
            params: { kategori },
          }
        );
        setBarang(response.data);
      } catch (error) {
        toast.error("Gagal mengambil data");
      } finally {
        setIsLoading(false);
      }
    };

    getPenitip();
    getBarang();
  }, [isLoading]);

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditData({
      namaBarang: item.namaBarang,
      kategoriBarang: item.kategoriBarang,
      kodeProduk: item.kodeProduk,
      hargaAwal: item.hargaAwal.toString(),
      hargaJual: item.hargaJual.toString(),
      stock: item.stock.toString(),
      penitipId: item.penitipId,
    });
  };

  // Fungsi untuk menyimpan perubahan
  const saveEdit = async (id) => {
    try {
      const loadingToast = toast.loading("Menyimpan perubahan...");

      const dataToSend = {
        ...editData,
        hargaAwal: convertRupiahToNumber(editData.hargaAwal),
        hargaJual: convertRupiahToNumber(editData.hargaJual),
        stock: parseInt(editData.stock),
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/update-barang/${id}`,
        dataToSend
      );

      if (response) {
        toast.dismiss(loadingToast);
        toast.success("Data berhasil diupdate");
        setIsLoading(true);
      }

      setEditingId(null);
      setEditData({
        namaBarang: "",
        kategoriBarang: "",
        kodeProduk: "",
        hargaAwal: "",
        hargaJual: "",
        stock: "",
        penitipId: "",
      });
    } catch (error) {
      toast.error("Gagal mengupdate data");
      console.error("Error updating data:", error);
    }
  };

  // Fungsi untuk membatalkan edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({
      namaBarang: "",
      kategoriBarang: "",
      kodeProduk: "",
      hargaJual: "",
      stock: "",
      penitipId: "",
    });
  };

  // Handle perubahan data edit
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "hargaJual") {
      setEditData((prev) => ({
        ...prev,
        [name]: value.replace(/\D/g, ""),
      }));
    } else {
      setEditData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
      return;
    }

    try {
      const loadingToast = toast.loading("Menghapus barang...");

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/delete-barang/${id}`
      );

      if (response) {
        toast.dismiss(loadingToast);
        toast.success("Barang berhasil dihapus");
        setIsLoading(true); // Trigger refresh data
      }
    } catch (error) {
      toast.error("Gagal menghapus barang");
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="flex md:flex-row flex-col md:space-x-5">
      <div className="flex md:w-1/2 w-full md:flex-row flex-col">
        <div className="md:w-1/2 w-full pb-5">
          <h1 className="text-2xl text-center mb-5 top-0 py-4 bg-white">
            Tambah Barang
          </h1>
          <form
            onSubmit={handleBarangSubmit}
            className="space-y-5 md:border-r border-black p-5"
          >
            <div className="flex space-y-2 items-start flex-col">
              <label>Nama Barang:</label>
              <input
                name="namaBarang"
                value={dataBarang.namaBarang}
                onChange={handleBarangChange}
                className="w-full border-2 border-black rounded-md p-1 placeholder-gray-500 text-sm"
              />
            </div>

            <div className="flex space-y-2 items-start flex-col">
              <label>Kategori Barang:</label>
              <input
                name="kategoriBarang"
                value={dataBarang.kategoriBarang}
                onChange={handleBarangChange}
                className="w-full border-2 border-black rounded-md p-1 placeholder-gray-500 text-sm"
              />
            </div>

            <div className="flex space-y-2 items-start flex-col">
              <label>Penitip:</label>
              <select
                name="penitip"
                value={dataBarang.penitip}
                onChange={handleBarangChange}
                className="w-full border-2 border-black rounded-md p-1 text-sm"
              >
                <option value="">Pilih Penitip</option>
                {penitip.map((pen) => (
                  <option key={pen.id} value={pen.nama}>
                    {pen.nama} ({pen.kode})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-y-2 items-start flex-col">
              <label>Harga Awal:</label>
              <input
                name="hargaAwal"
                type="text"
                inputMode="numeric"
                value={formatRupiah(dataBarang.hargaAwal)}
                onChange={handleBarangChange}
                className="w-full border-2 border-black rounded-md p-1 placeholder-gray-500 text-sm"
              />
            </div>

            <div className="flex space-y-2 items-start flex-col">
              <label>Harga Jual:</label>
              <input
                name="hargaJual"
                type="text"
                value={formatRupiah(dataBarang.hargaJual)}
                onChange={handleBarangChange}
                className="w-full border-2 border-black rounded-md p-1 placeholder-gray-500 text-sm"
              />
            </div>

            <div className="flex space-y-2 items-start flex-col">
              <label>Stock:</label>
              <input
                name="stock"
                inputMode="numeric"
                value={dataBarang.stock}
                onChange={handleBarangChange}
                className="w-full border-2 border-black rounded-md p-1 placeholder-gray-500 text-sm"
              />
            </div>

            <div className="flex space-y-2 items-start flex-col">
              <label>Kode Produk:</label>
              <input
                name="kodeProduk"
                value={dataBarang.kodeProduk}
                className="w-full border-2 border-black rounded-md p-1 placeholder-gray-500 text-sm"
                readOnly
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 rounded-md p-2 text-white float-end"
            >
              Tambah Barang
            </button>
          </form>
        </div>
        <div className="md:w-1/2 w-full">
          <h1 className="text-2xl text-center mb-5 top-0 py-4 bg-white">
            Tambah Penitip
          </h1>
          <form
            onSubmit={handlePenitipSubmit}
            className="space-y-5 md:border-r border-black p-5"
          >
            <div className="flex space-y-2 items-start flex-col">
              <label>Nama Penitip:</label>
              <input
                name="namaPenitip"
                value={hurufKapital(dataPenitip.namaPenitip)}
                onChange={handlePenitipChange}
                className="w-full border-2 border-black rounded-md p-1 placeholder-gray-500 text-sm"
              />
            </div>

            <div className="flex space-y-2 items-start flex-col">
              <label>Kode Penitip:</label>
              <input
                name="kodePenitip"
                value={dataPenitip.kodePenitip}
                onChange={handlePenitipChange}
                className="w-full border-2 border-black rounded-md p-1 placeholder-gray-500 text-sm"
              />
            </div>

            <div className="flex space-y-2 items-start flex-col">
              <label>Nomor Penitip:</label>
              <input
                name="nomorPenitip"
                value={dataPenitip.nomorPenitip}
                onChange={handlePenitipChange}
                className="w-full border-2 border-black rounded-md p-1 placeholder-gray-500 text-sm"
                type="tel"
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 rounded-md p-2 text-white float-end"
            >
              Tambah Penitip
            </button>
          </form>
          <div className="w-full px-5">
            <h1 className="text-xl text-center mb-2">Data Penitip</h1>
            <table className="w-full bg-zinc-100 mt-5">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nama</th>
                  <th>Kode</th>
                  <th>No. Hp</th>
                </tr>
              </thead>
              <tbody>
                {penitip.map((penitip, index) => (
                  <tr
                    key={penitip.id}
                    className="text-center border border-x-0"
                  >
                    <td>{index + 1}</td>
                    <td>{penitip.nama}</td>
                    <td>{penitip.kode}</td>
                    <td>{penitip.nomor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:w-1/2 w-full md:pr-5 md:mt-0 mt-5">
        <h1 className="text-2xl text-center mb-5 w-full top-0 py-4 bg-white">
          Data Barang
        </h1>
        <div className="md:p-0 p-5">
          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-zinc-100">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nama</th>
                  <th>Kategori</th>
                  <th>Kode</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Penitip</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {barang.map((item, index) => (
                  <tr key={item.id} className="text-center border border-x-0">
                    <td>{index + 1}</td>
                    <td>
                      {editingId === item.id ? (
                        <input
                          type="text"
                          name="namaBarang"
                          value={editData.namaBarang}
                          onChange={handleEditChange}
                          className="w-fit p-1 text-center border rounded"
                        />
                      ) : (
                        item.namaBarang
                      )}
                    </td>
                    <td>
                      {editingId === item.id ? (
                        <input
                          type="text"
                          name="kategoriBarang"
                          value={editData.kategoriBarang}
                          onChange={handleEditChange}
                          className="w-fit p-1 text-center border rounded"
                        />
                      ) : (
                        item.kategoriBarang
                      )}
                    </td>
                    <td>
                      {editingId === item.id ? (
                        <input
                          type="text"
                          name="kodeProduk"
                          value={editData.kodeProduk}
                          onChange={handleEditChange}
                          className="w-fit p-1 text-center border rounded"
                          readOnly
                        />
                      ) : (
                        item.kodeProduk
                      )}
                    </td>
                    <td>
                      {editingId === item.id ? (
                        <input
                          type="text"
                          name="hargaAwal"
                          value={formatRupiah(editData.hargaAwal)}
                          onChange={handleEditChange}
                          className="w-fit p-1 text-center border rounded"
                        />
                      ) : (
                        formatRupiah(item.hargaAwal)
                      )}
                    </td>
                    <td>
                      {editingId === item.id ? (
                        <input
                          type="text"
                          name="hargaJual"
                          value={formatRupiah(editData.hargaJual)}
                          onChange={handleEditChange}
                          className="w-fit p-1 text-center border rounded"
                        />
                      ) : (
                        formatRupiah(item.hargaJual)
                      )}
                    </td>
                    <td>
                      {editingId === item.id ? (
                        <input
                          type="number"
                          name="stock"
                          value={editData.stock}
                          onChange={handleEditChange}
                          className="w-20 p-1 text-center border rounded"
                          min="0"
                        />
                      ) : (
                        item.stock
                      )}
                    </td>
                    <td>
                      {editingId === item.id ? (
                        <select
                          name="penitipId"
                          value={editData.penitipId}
                          onChange={handleEditChange}
                          className="w-fit p-1 text-center border rounded"
                        >
                          {penitip.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nama}
                            </option>
                          ))}
                        </select>
                      ) : (
                        item.namaPenitip
                      )}
                    </td>
                    <td>
                      {editingId === item.id ? (
                        <div className="flex justify-center space-x-1">
                          <button
                            onClick={() => saveEdit(item.id)}
                            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center space-x-1">
                          <button
                            onClick={() => startEdit(item)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahBarang;
