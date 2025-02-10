import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import CartTab from "./CartTab";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

const Kasir = () => {
  const statusTabCart = useSelector((store) => store.cart.statusTab);
  const location = useLocation();

  const pathname = location.pathname;
  return (
    <div className="bg-zinc-200 flex h-screen">
      <Header />
      <main className={`w-full p-5 overflow-auto`}>
        <Toaster />
        <Outlet />
      </main>
      {pathname === "/" && <CartTab />}
    </div>
  );
};

export default Kasir;
