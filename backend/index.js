import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import searchRoute from "./routes/search.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/search", searchRoute);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
