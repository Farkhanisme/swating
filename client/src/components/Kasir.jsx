import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import CartTab from "./CartTab";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

const Kasir = () => {
  const statusTabCart = useSelector(store => store.cart.statusTab);
  return (
    <div className="bg-zinc-200">
      <main className={`w-[1200px] max-w-full m-auto md:p-5 p-1 transform transition-transform duration-500 ${statusTabCart === false ? "" : "-translate-x-72"}`}>
        <Toaster />
        <Header />
        <Outlet />
      </main>
      <CartTab />
    </div>
  );
};

export default Kasir;
