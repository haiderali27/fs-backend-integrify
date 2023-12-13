import express from "express"
import UserController from "../controllers/userController"
import { checkAuth } from "../middlewares/checkAuth";

const router = express.Router()

router.post("/login", UserController.login)  
router.get("/profile", checkAuth, UserController.getProfile)  


export default router