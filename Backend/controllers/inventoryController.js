const Inventory = require("../models/inventoryModel");
const Product = require("../models/productModel"); // Ensure Product model is imported

// Add or update inventory
exports.addOrUpdateInventory = async (req, res) => {
  try {
    const { productId, quantity, discount, inventoryType } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: "productId and quantity are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const unitPrice = product.price;
    const existingInventory = await Inventory.findOne({ product: productId });

    if (existingInventory) {
      // Update logic
      const totalQty = existingInventory.quantity + quantity;
      const totalCost = (existingInventory.buyingPrice * existingInventory.quantity) + (unitPrice * quantity);
      const newbuyingPrice = totalCost / totalQty;
      const newSellingPrice = newbuyingPrice * 1.2;

      existingInventory.quantity = totalQty;
      existingInventory.buyingPrice = newbuyingPrice;
      existingInventory.sellingPrice = newSellingPrice;
      if (discount !== undefined) existingInventory.discount = discount;
      if (inventoryType) existingInventory.inventoryType = inventoryType;

      await existingInventory.save();

      return res.status(200).json({
        message: "Inventory updated",
        data: await existingInventory.populate("product")
      });
    }

    // New inventory entry
    const buyingPrice = product.price;
    const sellingPrice = buyingPrice * 1.2;

    const newInventory = await Inventory.create({
      product: productId,
      quantity,
      buyingPrice,
      sellingPrice,
      discount: discount || 0,
      inventoryType
    });

    res.status(201).json({
      message: "Inventory created",
      data: await newInventory.populate("product")
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new inventory only if one doesn't exist
exports.createInventory = async (req, res) => {
  try {
    const { productId, quantity, discount, inventoryType } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: "productId and quantity are required" });
    }

    const existing = await Inventory.findOne({ product: productId });
    if (existing) {
      return res.status(409).json({ error: "Inventory already exists for this product. Use PUT to update." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const buyingPrice = product.price;
    const sellingPrice = buyingPrice * 1.2;

    const newInventory = await Inventory.create({
      product: productId,
      quantity,
      buyingPrice,
      sellingPrice,
      discount: discount || 0,
      inventoryType
    });

    res.status(201).json({
      message: "Inventory created",
      data: await newInventory.populate("product")
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update inventory by ID
exports.updateInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!inventory) return res.status(404).send("Inventory not found");
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all inventory with full product info
exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("product");
    res.status(200).json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get inventory by productId
exports.getInventoryByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const inventory = await Inventory.findOne({ product: productId }).populate("product");
    if (!inventory) return res.status(404).json({ message: "Inventory not found" });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Delete inventory by ID
exports.deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);
    if (!inventory) return res.status(404).json({ message: "Inventory not found" });

    res.status(200).json({ message: "Inventory deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
