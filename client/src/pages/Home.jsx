import React, { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../store/cart";
import { formatRupiah } from "../functions/util";

const Home = (props) => {
  const [barang, setBarang] = useState([]);
  const [kategori, setKategori] = useState("");
  useEffect(() => {
    const getBarang = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-barang`, {
          params: { kategori },
        });
        setBarang(response.data);
      } catch (error) {
        toast.error("Gagal mengambil data");
        console.log(error);
      }
    };
    getBarang();
  }, [kategori]);

  const handleClick = (e) => {
    const { name } = e.target;

    switch (name) {
      case "rokok":
        setKategori("rokok");
        break;
      case "tembakau":
        setKategori("tembakau");
        break;
      case "oleh-oleh":
        setKategori("oleh-oleh");
        break;
      case "aksesoris":
        setKategori("aksesoris");
        break;
      case "minuman":
        setKategori("minuman");
        break;
      default:
        setKategori("");
        break;
    }
  };

  
  const carts = useSelector((store) => store.cart.items);
  const dispatch = useDispatch();

  const handleAddToCart = (productId) => {
    dispatch(
      addToCart({
        productId: productId,
        quantity: 1,
      })
    );
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredBarang = barang.filter((item) =>
    item.namaBarang.toLowerCase().includes(searchTerm)
  );
  return (
    <div>
      <Toaster />
      <h1 className="text-3xl my-5 text-center">Data Barang</h1>
      <input
      type="text"
      placeholder="Cari barang..."
      className="border p-2 mb-4 rounded"
      onChange={handleSearch}
    />
      <div className="flex gap-3 justify-around mb-5 flex-wrap">
        <button
          className="bg-green-500 rounded-sm text-white md:p-2 p-1"
          onClick={handleClick}
        >
          All
        </button>
        <button
          className="bg-green-500 rounded-sm text-white md:p-2 p-1"
          name="rokok"
          onClick={handleClick}
        >
          Rokok
        </button>
        <button
          className="bg-green-500 rounded-sm text-white md:p-2 p-1"
          name="aksesoris"
          onClick={handleClick}
        >
          Aksesoris
        </button>
        <button
          className="bg-green-500 rounded-sm text-white md:p-2 p-1"
          name="tembakau"
          onClick={handleClick}
        >
          Tembakau
        </button>
        <button
          className="bg-green-500 rounded-sm text-white md:p-2 p-1"
          name="oleh-oleh"
          onClick={handleClick}
        >
          Oleh-oleh
        </button>
        <button
          className="bg-green-500 rounded-sm text-white md:p-2 p-1"
          name="minuman"
          onClick={handleClick}
        >
          Minuman
        </button>
      </div>
      <table className="w-full bg-zinc-100">
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama</th>
            {/* <th>Kategori</th> */}
            <th>Kode</th>
            <th>Harga</th>
            {/* <th>Stok</th> */}
            <th>Add</th>
          </tr>
        </thead>
        <tbody>
          {filteredBarang.map((barang, index) => (
            <tr key={barang.id} className="text-center border border-x-0">
              <td>{index + 1}</td>
              <td>{barang.namaBarang}</td>
              {/* <td>{barang.kategoriBarang}</td> */}
              <td>{barang.kodeProduk}</td>
              <td>{formatRupiah(barang.hargaJual)}</td>
              {/* <td>{barang.stock}</td> */}
              <td>
                <button
                  className="bg-green-500 p-3 rounded-sm text-white"
                  onClick={() => handleAddToCart(barang.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-cart-plus"
                    viewBox="0 0 16 16"
                  >
                    <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z" />
                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
