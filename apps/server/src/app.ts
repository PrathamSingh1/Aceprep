import exrpess from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware";


const app = exrpess();

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL
}));
app.use(exrpess.json());

// routes 
app.use("/api/v1");

app.use(errorHandler);
export default app;