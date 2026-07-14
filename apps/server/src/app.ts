import exrpess from "express";
import cors from "cors";
import helmet from "helmet";

const app = exrpess();

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL
}));
app.use(exrpess.json());

// routes 

export default app;