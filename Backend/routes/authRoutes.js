import express from "express";
import {
  loginUser,
  registerUser,
  googleLogin,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);

router.get("/me", protect, (req, res) => {
  res.status(200).json(req.user);
});
export default router;
