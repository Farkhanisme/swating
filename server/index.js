import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import KasirRoute from "./routes/KasirRoutes.js";
import { connected } from "./database/db.js";
import totalRouter from "./routes/TotalRoutes.js";
import stockRouter from "./routes/StockRoutes.js";
import setorRouter from "./routes/SetorRoutes.js";
import penjualanRouter from "./routes/PenjualanRoutes.js";
import pengeluaranRouter from "./routes/PengeluaranRoutes.js";
import barangRouter from "./routes/BarangRoutes.js";
import penitipRouter from "./routes/PenitipRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", KasirRoute);
app.use("/admin", totalRouter);
app.use("/admin", stockRouter);
app.use("/admin", setorRouter);
app.use("/admin", penjualanRouter);
app.use("/admin", pengeluaranRouter);
app.use("/admin", barangRouter);
app.use("/admin", penitipRouter);
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send(`server berjalan di ${PORT}`);
});

app.listen(PORT, async () => {
  await connected();
  console.log(`running on port ${PORT}`);
});
