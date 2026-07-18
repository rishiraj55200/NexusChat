import express from "express";
import {
  getAllUsers,
  getAUser,
  loginUser,
  loginWithPassword,
  myProfile,
  registerWithPassword,
  updateName,
  verifyUser,
} from "../controllers/user.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/login-password", loginWithPassword);
router.post("/register-password", registerWithPassword);
router.post("/verify", verifyUser);
router.get("/me", isAuth, myProfile);
router.get("/user/all", isAuth, getAllUsers);
router.get("/user/:id", getAUser);
router.post("/update/user", isAuth, updateName);

export default router;
