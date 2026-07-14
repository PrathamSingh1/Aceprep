import express from "express";


const router = express.Router();

router.use("/auth");
router.use("/questions");

export default router;