import e from "express";
import { getAllTotal, getTotal, getTotalPerhari } from "../controllers/TotalController.js";

const router = e.Router();

router.get("/get-total", getTotal);
router.get("/get-total-perhari", getTotalPerhari);
router.get("/get-all-total", getAllTotal);

export default router;

