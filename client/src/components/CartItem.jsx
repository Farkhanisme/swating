import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { changeQuantity } from "../store/cart";
import axios from "axios";

const CartItem = (props) => {
  const { productId, quantity } = props.data;
  const [barang, setBarang] = useState([]);
  const [detail, setDetail] = useState([]);
  const kategori = "";
  const dispatch = useDispatch();

  useEffect(() => {
    const getBarang = async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-barang`, {
            params: { kategori },
          });
      setBarang(response.data);
    };
    getBarang();
  }, []); 

  useEffect(() => {
    if (barang.length > 0) {
      const findDetail = barang.find((barang) => barang.id === productId);
      setDetail(findDetail);
    }
  }, [barang, productId]);
  
  const handleMinusQuantity = () => {
    const minus = detail.namaBarang.toLowerCase().includes("garangan") ? 0.25 : 1;;
    dispatch(
      changeQuantity({
        productId: productId,
        quantity: quantity - minus,
      })
    );
  };

  const handlePlusQuantity = () => {
    const plus = detail.namaBarang.toLowerCase().includes("garangan") ? 0.25 : 1;;
    dispatch(
      changeQuantity({
        productId: productId,
        quantity: quantity + plus,
      })
    );
  };

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

  return (
    <div className="flex justify-between items-center bg-slate-600 text-white md:p-2 p-5 border-b-2 border-slate-700 gap-5 rounded-md">
      <h3>{detail.namaBarang}</h3>
      <p className="value">{formatRupiah(detail.hargaJual * quantity)}</p>
      <div className="w-20 flex justify-between">
        <button
          className="bg-gray-200 rounded-full w-6 h-6 text-cyan-600"
          onClick={handleMinusQuantity}
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          className="bg-gray-200 rounded-full w-6 h-6 text-cyan-600"
          onClick={handlePlusQuantity}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartItem;
