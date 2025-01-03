import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { convertRupiahToNumber, formatRupiah, hurufKapital } from "../functions/util";

const TambahBarang = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [penitip, setPenitip] = useState([]);
  const [barang, setBarang] = useState([]);

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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/get-penitip`);
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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/get-barang`, {
          params: { kategori },
        });
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

  return (
    <div className="flex md:flex-row flex-col md:space-x-5">
      {/* <Toaster /> */}
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
        <table className="w-full bg-zinc-100">
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Kode</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Penitip</th>
            </tr>
          </thead>
          <tbody>
            {barang.map((barang, index) => (
              <tr key={barang.id} className="text-center border border-x-0">
                <td>{index + 1}</td>
                <td>{barang.namaBarang}</td>
                <td>{barang.kategoriBarang}</td>
                <td>{barang.kodeProduk}</td>
                <td>{barang.hargaJual}</td>
                <td>{barang.stock}</td>
                <td>{barang.namaPenitip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TambahBarang;
