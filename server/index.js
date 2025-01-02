import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import KasirRoute from "./routes/KasirRoutes.js";
import AdminRoute from "./routes/AdminRoutes.js";
import { testConnection } from "./database/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", KasirRoute);
app.use("/admin", AdminRoute);
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send(`server berjalan di ${PORT}`);
});

app.listen(PORT, async () => {
  await testConnection();
  console.log(`running on port ${PORT}`);
});
