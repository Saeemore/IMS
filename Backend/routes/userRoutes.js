const express = require("express");
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");


// const authMiddleware = require("../middlewares/authMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");

const router = express.Router();

router.get("/", authMiddleware, checkPermission, getUsers);
router.post("/add", addUser);
router.put("/edit/:id", authMiddleware, checkPermission, updateUser);
router.delete("/delete/:id", authMiddleware, checkPermission, deleteUser);

module.exports = router;