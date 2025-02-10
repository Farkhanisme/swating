import e from "express";
import {
  checkout,
  deleteBarang,
  getBarang,
  insertBarang,
  updateBarang,
} from "../controllers/BarangController.js";

const router = e.Router();

router.post("/checkout", checkout);
router.post("/insert-barang", insertBarang);
router.get("/get-barang", getBarang);
router.put("/update-barang/:id", updateBarang);
router.delete("/delete-barang/:id", deleteBarang);

export default router;
