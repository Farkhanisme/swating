import e from "express";
import { deletePenjualanLain, deleteRiwayatPenjualan, getPenjualan, getPenjualanLain, getPenjualanPerhari, getRiwayatPenjualan, tambahPenjualanLain } from "../controllers/PenjualanController.js";

const router = e.Router();

router.get("/get-penjualan", getPenjualan);
router.get("/get-penjualan-lain", getPenjualanLain);
router.post("/tambah-penjualan-lain", tambahPenjualanLain);
router.get("/get-penjualan-perhari", getPenjualanPerhari);
router.get("/get-riwayat-penjualan", getRiwayatPenjualan);
router.delete("/delete-riwayat-penjualan/:id", deleteRiwayatPenjualan);
router.delete("delete-penjualan-lain/:id", deletePenjualanLain)

export default router;
