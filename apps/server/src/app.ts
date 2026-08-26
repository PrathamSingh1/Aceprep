import express from "express";
import cors from "cors";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";
import { getAuth } from "./lib/auth.js";
import { errorHandler } from "./middleware/error.middleware.js";
import router from "./routes/index.js";
import { getEnv } from "./config/env.js";

const app = express();

app.use(helmet());
app.use(cors({
    origin: (_origin, callback) => {
        callback(null, getEnv().FRONTEND_URL);
    },
    credentials: true,
}));

// better-auth routes BEFORE express.json()
app.all("/api/auth/{*any}", (req, res) => toNodeHandler(getAuth())(req, res));

// body parser AFTER better-auth
app.use(express.json());

// routes
app.use("/api/v1", router);

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use(errorHandler);
export default app;
