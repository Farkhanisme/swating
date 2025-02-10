import e from "express";
import { getDataSetor, getSetor, getStatusSetor, updateStatus, updateStatusSetor } from "../controllers/SetorController.js";

const router = e.Router();

router.get("/get-setor", getSetor);
router.put("/update-status", updateStatus);
router.put("/update-status-setor", updateStatusSetor);
router.get("/get-setor-status", getStatusSetor);
router.get("/get-data-setor", getDataSetor);

export default router;
