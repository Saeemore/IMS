const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.post("/add", productController.createProduct);
router.get("/", productController.getProducts);
// router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/search", productController.searchProducts);
router.get("/:id", productController.getProductById);

module.exports = router;
