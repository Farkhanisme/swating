import e from "express";
import { deleteStock, getAllStock, getStock, tambahStock, updateStock } from "../controllers/StockController.js";

const router = e.Router();

router.get("/get-all-stock", getAllStock);
router.get("/get-stock", getStock);
router.post("/tambah-stock", tambahStock);
router.put("/update-stock/:id", updateStock);
router.delete("/delete-stock/:id", deleteStock);

export default router;
