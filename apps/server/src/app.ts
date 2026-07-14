import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware";
import router from "./routes";


const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL
}));
app.use(express.json());

// routes 
app.use("/api/v1", router);

app.use("/health", (req, res) => {
    res.json({
        status: "ok"
    })
})

app.use(errorHandler);
export default app;