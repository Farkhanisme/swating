import e from "express";
import { deletePengeluaran, getPengeluaran, insertPengeluaran, updatePengeluaran } from "../controllers/PengeluaranController.js";

const router = e.Router();

router.post("/insert-pengeluaran", insertPengeluaran);
router.get("/get-pengeluaran", getPengeluaran);
router.delete("/delete-pengeluaran/:id", deletePengeluaran);
router.put("/update-pengeluaran/:id", updatePengeluaran);

export default router;
