import e from "express";
import {
  checkout,
  getBarang,
  getPengeluaran,
  getPenjualan,
  getTotal,
  insertPengeluaran,
} from "../controllers/kasirController.js";

const router = e.Router();

router.post("/checkout", checkout);
router.get("/get-barang", getBarang);
router.get("/get-penjualan", getPenjualan);
router.get("/get-total", getTotal);
router.get("/get-pengeluaran", getPengeluaran);
router.post("/insert-pengeluaran", insertPengeluaran);

export default router;
