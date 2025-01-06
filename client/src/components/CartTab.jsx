import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "./CartItem";
import { toggleStatusTab } from "../store/cart";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const CartTab = () => {
  const carts = useSelector((store) => store.cart.items);
  const statusTab = useSelector((store) => store.cart.statusTab);
  const dispatch = useDispatch();
  const [barang, setBarang] = useState([]);
  const [sum, setSum] = useState(0);

  const navigate = useNavigate();

  const handleCloseTab = () => {
    dispatch(toggleStatusTab());
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
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatRupiah = (angka) => {
    let number_string = angka.toString().replace(/[^,\d]/g, ""),
      split = number_string.split(","),
      sisa = split[0].length % 3,
      rupiah = split[0].substr(0, sisa),
      ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      let separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    return "Rp. " + rupiah;
  };

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
              totalHarga: product.hargaJual * cartItem.quantity,
              totalSetor: product.hargaAwal * cartItem.quantity,
            };
          }
          return null;
        })
        .filter(Boolean);
        
      await axios.post(`${import.meta.env.VITE_API_URL}/checkout`, {
        data: checkoutDetails,
      });

      toast.success("Checkout berhasil!");
      setTimeout(() => {
        navigate(0);
      }, 300);
    } catch (error) {
      console.error("Gagal melakukan checkout:", error);
      toast.error("Checkout gagal!");
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 bg-gray-700 shadow-2xl md:w-96 w-full h-full grid grid-rows-[60px_1fr_112px] transform transition-transform duration-500 ${
        statusTab === false ? "translate-x-full" : ""
      }`}
    >
      <Toaster />
      <h2 className="p-5 text-white text-2xl">Cart</h2>
      <div>
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
            onClick={handleCloseTab}
          >
            CLOSE
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
