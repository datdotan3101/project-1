import express from "express";
import { authAdmin, registerAdmin } from "../controllers/adminController.js";

const adminRoutes = express.Router();

adminRoutes.post("/login", authAdmin);
adminRoutes.post("/", registerAdmin); // Route tạo admin

export default adminRoutes;
