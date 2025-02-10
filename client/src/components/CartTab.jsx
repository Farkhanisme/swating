import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "./CartItem";
import { handleEmpty, toggleStatusTab } from "../store/cart";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { formatRupiah } from "../functions/util";

const CartTab = () => {
  const carts = useSelector((store) => store.cart.items);
  const statusTab = useSelector((store) => store.cart.statusTab);
  const dispatch = useDispatch();
  const [barang, setBarang] = useState([]);
  const [sum, setSum] = useState(0);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0])

  const navigate = useNavigate();

  const handleClear = () => {
    dispatch(handleEmpty());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const elements = document.querySelectorAll(".value");
      const total = Array.from(elements).reduce((acc, elem) => {
        const value = parseInt(
          elem.textContent.replace("Rp.", "").replace(/\./g, "").trim(),
          10
        );
        return acc + value;
      }, 0);
      setSum(total);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getBarang = async () => {
      const kategori = "";
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/get-barang`,
          {
            params: { kategori },
          }
        );
        setBarang(response.data);
      } catch (error) {
        console.error("Gagal mengambil data barang:", error);
      }
    };
    getBarang();
  }, [carts]);

  const handleCheckoutButton = async () => {
    try {
      const checkoutDetails = carts
        .map((cartItem) => {
          const product = barang.find((b) => b.id === cartItem.productId);
          if (product) {
            return {
              barangId: product.id,
              jumlahTerjual: cartItem.quantity,
              tanggal: tanggal,
            };
          }
          return null;
        })
        .filter(Boolean);

      await axios.post(`${import.meta.env.VITE_API_URL}/admin/checkout`, {
        data: checkoutDetails,
      });

      toast.success("Checkout berhasil!");
      handleClear();
    } catch (error) {
      console.error("Gagal melakukan checkout:", error);
      toast.error("Checkout gagal!");
    }
  };

  const handleDate = (e) => {
    setTanggal(e);
  }

  return (
    <div
      className={`top-0 right-0 bg-gray-700 w-1/3 grid grid-rows-[60px_60px_1fr_112px]`}
    >
      <Toaster />
      <h2 className="p-5 text-white text-2xl text-center shadow-md">SWATING</h2>
      <input type="date" name="tanggal" id="tanggal" className="bg-transparent w-full h-5 mx-auto p-5 text-gray-100" value={tanggal} onChange={(e) => handleDate(e.target.value)} />
      <div className="overflow-y-auto">
        {carts.map((item, key) => (
          <CartItem key={key} data={item} />
        ))}
      </div>
      <div className="flex flex-col">
        <h3 className="w-full h-14 bg-green-500 text-white text-xl flex items-center justify-center">
          Total Bayar: {formatRupiah(sum)}
        </h3>
        <div>
          <button
            className="bg-black text-white w-1/2 h-14"
            onClick={handleClear}
          >
            CLEAR
          </button>
          <button
            className="bg-amber-600 text-white w-1/2 h-14"
            onClick={handleCheckoutButton}
          >
            CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartTab;
