const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require("../middleware/checkPermission");

router.post("/add" , authMiddleware, checkPermission , productController.createProduct);
router.get("/",authMiddleware,checkPermission , productController.getProducts);
// router.get("/:id", productController.getProductById);
router.put("/:id",authMiddleware,checkPermission , productController.updateProduct);
router.delete("/:id",authMiddleware,checkPermission , productController.deleteProduct);
router.get("/search",authMiddleware,checkPermission , productController.searchProducts);
router.get("/:id",authMiddleware,checkPermission , productController.getProductById);

module.exports = router;
