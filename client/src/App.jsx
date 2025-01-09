import Kasir from "./components/Kasir";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Penjualan from "./pages/PenjualanKasir";
import TambahBarang from "./pages/TambahBarang";
import Admin from "./components/Admin";
import PenjualanKasir from "./pages/PenjualanKasir";
import PenjualanAdmin from "./pages/PenjualanAdmin";
import Pengeluaran from "./pages/Pengeluaran";
import Stock from "./pages/Stock";
import RiwayatPenjualan from "./pages/RiwayatPenjualan";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Kasir />}>
            <Route index element={<Home />} />
            <Route path="detail-penjualan" element={<PenjualanKasir />} />
            <Route path="pengeluaran" element={<Pengeluaran />} />
          </Route>
          <Route path="/admin" element={<Admin />}>
            <Route index element={<TambahBarang />} />
            <Route path="kasir" element={<Home />} />
            <Route path="detail-penjualan" element={<PenjualanAdmin />} />
            <Route path="pengeluaran" element={<Pengeluaran />} />
            <Route path="stock" element={<Stock />} />
            <Route path="riwayat" element={<RiwayatPenjualan />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
