import Kasir from "./components/Kasir";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Penjualan from "./pages/PenjualanKasir";
import TambahBarang from "./pages/TambahBarang";
import Admin from "./components/Admin";
import PenjualanKasir from "./pages/PenjualanKasir";
import PenjualanAdmin from "./pages/PenjualanAdmin";
import Pengeluaran from "./pages/Pengeluaran";
import ReStock from "./pages/ReStock";
import Stock from "./pages/Stock";
import RiwayatPenjualan from "./pages/RiwayatPenjualan";
import Setor from "./pages/Setor";
import DataSetor from "./pages/DataSetor";
import PenjualanLain from "./pages/PenjualanLain";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Kasir />}>
            <Route index element={<Home />} />
            <Route path="tambah-barang" element={<TambahBarang />} />
            <Route path="detail-penjualan" element={<PenjualanAdmin />} />
            <Route
              path="detail-penjualan-perhari"
              element={<PenjualanKasir />}
            />
            <Route path="pengeluaran" element={<Pengeluaran />} />
            <Route path="riwayat" element={<RiwayatPenjualan />} />
            <Route path="setor" element={<Setor />} />
            <Route path="data-setor" element={<DataSetor />} />
            {/* <Route path="stock" element={<ReStock />} /> */}
            <Route path="stock" element={<Stock />} />
            <Route path="restock" element={<ReStock />} />
            <Route path="penjualan-lain" element={<PenjualanLain />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
