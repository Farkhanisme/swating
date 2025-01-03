import e from "express";
import {
  checkout,
  deleteBarang,
  getAllTotal,
  getBarang,
  getPenitip,
  getPenjualan,
  getSetor,
  getTotal,
  insertBarang,
  insertPengeluaran,
  insertPenitip,
  updateBarang,
} from "../controllers/AdminController.js";

const router = e.Router();

router.post("/insert-barang", insertBarang);
router.post("/checkout", checkout);
router.get("/get-barang", getBarang);
router.get("/get-penjualan", getPenjualan);
router.get("/get-total", getTotal);
router.get("/get-all-total", getAllTotal);
router.get("/get-setor", getSetor);
router.post("/insert-pengeluaran", insertPengeluaran);
router.post("/update-barang", updateBarang);
router.post("/insert-penitip", insertPenitip);
router.get("/get-penitip", getPenitip);
router.put("/update-barang/:id", updateBarang);
router.delete("/delete-barang/:id", deleteBarang)

export default router;
