import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  convertRupiahToNumber,
  formatRupiah,
  hurufKapital,
} from "../functions/util";

const TambahBarang = () => {
  const [penitip, setPenitip] = useState([]);
  const [barang, setBarang] = useState([]);
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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

    const requiredFields = ["namaBarang", "kategoriBarang"];
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
      kodeProduk: dataBarang.kodeProduk,
    };

    console.log(dataBarangKirim);

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

      getBarang(); // Refresh data barang setelah menambahkan
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

      setDataPenitip({
        namaPenitip: "",
        kodePenitip: "",
      });

      getPenitip(); // Refresh data penitip setelah menambahkan
    } catch (error) {
      toast.error("Data gagal ditambahkan");
    }
  };

  const getPenitip = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/get-penitip`
      );
      setPenitip(response.data);
    } catch (error) {
      toast.error("Gagal mengambil data");
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
      setFilteredBarang(response.data); // Set filteredBarang dengan data awal
    } catch (error) {
      toast.error("Gagal mengambil data");
    }
  };

  useEffect(() => {
    getPenitip();
    getBarang();
  }, []);

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditData({
      namaBarang: item.namaBarang,
      kategoriBarang: item.kategoriBarang,
      kodeProduk: item.kodeProduk,
      hargaAwal: item.hargaAwal != null ? item.hargaAwal.toString() : 0,
      hargaJual: item.hargaJual.toString(),
      penitipId: item.penitipId,
    });
  };

  const saveEdit = async (id) => {
    try {
      const loadingToast = toast.loading("Menyimpan perubahan...");

      const dataToSend = {
        ...editData,
        hargaAwal:
          editData.hargaAwal != 0
            ? convertRupiahToNumber(editData.hargaAwal)
            : 0,
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
        getBarang();
      }

      setEditingId(null);
      setEditData({
        namaBarang: "",
        kategoriBarang: "",
        kodeProduk: "",
        hargaAwal: "",
        hargaJual: "",
        penitipId: "",
      });
    } catch (error) {
      toast.error("Gagal mengupdate data");
      console.error("Error updating data:", error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({
      namaBarang: "",
      kategoriBarang: "",
      kodeProduk: "",
      hargaJual: "",
      penitipId: "",
    });
  };

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
        getBarang();
      }
    } catch (error) {
      toast.error("Gagal menghapus barang");
      console.error("Error deleting item:", error);
    }
  };

  const handleSearch = (param) => {
    setSearchQuery(param);

    if (!param) {
      setFilteredBarang(barang); // Jika searchQuery kosong, tampilkan semua barang
      return;
    }

    const filtered = barang.filter((item) => {
      const searchLower = param.toLowerCase();
      return (
        item.namaBarang.toLowerCase().includes(searchLower) ||
        item.kategoriBarang.toLowerCase().includes(searchLower) ||
        item.kodeProduk.toLowerCase().includes(searchLower) ||
        item.nama?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredBarang(filtered);
  };

  const inputRef = useRef(null);

  const delSearch = () => {
    setSearchQuery("");
    setFilteredBarang(barang); // Reset filteredBarang ke semua data
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-row space-x-5 h-screen">
      <div className="flex md:w-1/2 w-full md:flex-row flex-col overflow-y-auto h-[95%]">
        <div className="md:w-1/2 w-full pb-5 overflow-y-scroll">
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
                inputMode="numeric"
                value={formatRupiah(dataBarang.hargaJual)}
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
          <div className="w-full px-5 overflow-x-scroll">
            <h1 className="text-xl text-center mb-2">Data Penitip</h1>
            <table className="w-full bg-zinc-100 mt-5 shadow-md rounded-md text-nowrap">
              <thead>
                <tr>
                  <th className="p-1">No.</th>
                  <th>Nama</th>
                  <th>Kode</th>
                  <th className="p-1">No. Hp</th>
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
      <div className="flex flex-col w-1/2 pr-5 mt-0 overflow-y-auto h-[95%]">
        <h1 className="text-2xl text-center mb-5 w-full top-0 py-4 bg-white">
          Data Barang
        </h1>
        <div className="flex space-x-5 items-center mb-5">
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari barang..."
            className="border w-full p-2 rounded"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button
            onClick={delSearch}
            className="bg-red-500 h-10 w-10 text-white rounded mr-2"
          >
            x
          </button>
        </div>
        <div className="overflow-x-scroll rounded-md">
          <table className="table-auto w-fit bg-zinc-100 shadow-md rounded-md text-nowrap">
            <thead>
              <tr>
                <th className="p-1">No.</th>
                <th>Nama</th>
                <th>Kategori</th>
                <th>Kode</th>
                <th>Harga Awal</th>
                <th>Harga Jual</th>
                <th>Penitip</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredBarang.map((item, index) => (
                <tr key={item.id} className="text-center border border-x-0">
                  <td>{index + 1}</td>
                  <td className="text-left">
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
                        inputMode="numeric"
                        name="hargaAwal"
                        value={formatRupiah(editData.hargaAwal)}
                        onChange={handleEditChange}
                        className="w-fit p-1 text-center border rounded"
                      />
                    ) : item.hargaAwal != null ? (
                      formatRupiah(item.hargaAwal)
                    ) : (
                      0
                    )}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        type="text"
                        inputMode="numeric"
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
                      <select
                        name="penitipId"
                        defaultValue={editData.penitipId}
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
                      item.nama
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
                      <div className="flex justify-center space-x-1 p-1">
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
  );
};

export default TambahBarang;