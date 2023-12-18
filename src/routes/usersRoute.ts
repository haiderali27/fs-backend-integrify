import express from "express"

import UserController from "../controllers/userController"

const router = express.Router()

router.get("/", UserController.findAllUser)
router.get("/:userId", UserController.findOneUser)
router.put("/:userId", UserController.findOneAndUpdate);
router.delete("/:userId", UserController.findOneAndDelete);
router.get("/offset", UserController.getOffsetUser);

router.post("/", UserController.signup)
router.post("/is-available", UserController.findUserByEmail)


export default router