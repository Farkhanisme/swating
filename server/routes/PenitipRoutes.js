import e from "express";
import { getPenitip, insertPenitip } from "../controllers/PenitipController.js";

const router = e.Router();

router.post("/insert-penitip", insertPenitip);
router.get("/get-penitip", getPenitip);

export default router;
