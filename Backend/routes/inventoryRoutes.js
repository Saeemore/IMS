const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require("../middleware/checkPermission");
const {
  addOrUpdateInventory,
  createInventory,
  updateInventory,
  getAllInventory,
  getInventoryByProductId,
  deleteInventory
} = require("../controllers/inventoryController");

// // Route to add or update inventory
router.post("/addupdate",authMiddleware,checkPermission , addOrUpdateInventory);

// Route to create inventory only if not exists
router.post("/add",authMiddleware,checkPermission , createInventory);

// Route to update inventory by ID
router.put("/:id",authMiddleware,checkPermission , updateInventory);

// Route to get all inventory
router.get("/",authMiddleware,checkPermission , getAllInventory);

// Route to get inventory by productId
router.get("/product/:productId",authMiddleware,checkPermission , getInventoryByProductId);

// Route to delete inventory by ID
router.delete("/:id",authMiddleware,checkPermission , deleteInventory);

module.exports = router;
