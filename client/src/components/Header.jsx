import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toggleStatusTab } from "../store/cart";

const Header = () => {
  const [quantity, setQuantity] = useState(0);
  const carts = useSelector((store) => store.cart.items);
  const dispatch = useDispatch();

  const location = useLocation();

  const pathname = location.pathname.startsWith("/admin");

  let path = "";
  if (pathname) {
    path = "/admin";
  } else {
    path = "/";
  }

  useEffect(() => {
    let total = 0;
    carts.forEach((item) => (total += item.quantity));
    setQuantity(total);
  });

  const handleStatusTab = () => {
    dispatch(toggleStatusTab());
  };
  return (
    <header className="flex justify-between items-center mb-5 sticky top-0 h-16 bg-zinc-200">
      <div className="space-x-5 flex flex-wrap">
        <Link to={path} className="text-xl font-semibold">
          Home
        </Link>
        <Link to="detail-penjualan" className="text-xl font-semibold">
          Detail Penjualan
        </Link>
        <Link to="pengeluaran" className="text-xl font-semibold">
          Pengeluaran
        </Link>
        {pathname && (
          <Link to="stock" className="text-xl font-semibold">
            Stock
          </Link>
        )}
        {pathname && (
          <Link to="riwayat" className="text-xl font-semibold">
            Riwayat
          </Link>
        )}
      </div>
      {!pathname && (
        <div
          className="w-10 h-10 bg-gray-100 rounded-full flex justify-center items-center relative"
          onClick={handleStatusTab}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-cart"
            viewBox="0 0 16 16"
          >
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
          </svg>
          <span className="absolute top-2/3 right-1/2 bg-red-500 text-white rounded-full text-sm w-5 h-5 flex justify-center items-center">
            {quantity}
          </span>
        </div>
      )}
    </header>
  );
};

export default Header;
