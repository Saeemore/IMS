const express = require("express");
const router = express.Router();

const {
  addOrUpdateInventory,
  createInventory,
  updateInventory,
  getAllInventory,
  getInventoryByProductId,
  deleteInventory
} = require("../controllers/inventoryController");

// Route to add or update inventory
router.post("/addupdate", addOrUpdateInventory);

// Route to create inventory only if not exists
router.post("/add", createInventory);

// Route to update inventory by ID
router.put("/:id", updateInventory);

// Route to get all inventory
router.get("/", getAllInventory);

// Route to get inventory by productId
router.get("/product/:productId", getInventoryByProductId);

// Route to delete inventory by ID
router.delete("/:id", deleteInventory); // <-- this line

module.exports = router;
