import e from "express";
import { checkout, getBarang, getPenitip, getPenjualan, getTotal, insertBarang, insertPengeluaran, insertPenitip } from "../controllers/AdminController.js";

const router = e.Router();

router.post("/insert-barang", insertBarang);
router.post("/checkout", checkout);
router.get("/get-barang", getBarang);
router.get("/get-penjualan", getPenjualan);
router.get("/get-total", getTotal);
router.post("/insert-pengeluaran", insertPengeluaran)

router.post("/insert-penitip", insertPenitip);
router.get("/get-penitip", getPenitip);

export default router;
