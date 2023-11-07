import express from "express"

import UserController from "../controllers/usersController.js"
import { validateUser } from "../middlewares/userValidate.js"

const router = express.Router()

router.get("/", UserController.findAllUser)
router.get("/:userId", UserController.findOneUser)
router.post("/",validateUser, UserController.createOneUser)
// router.put("/:productId", UserController.updateUser);
// router.delete("/:productId", UserController.deleteUser);

// router.use((req, res, next) => {
//     console.log("👀 got here")
//     res.on("finish", () => {
//       console.log("Record created:", {
//         /* log data */
//       })
//     })
//     next()
//   })

export default router