const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true // ensure one inventory per product
  },
  quantity: { type: Number, required: true },
    buyingPrice: { type: Number, required: true },
  inventoryType: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },

  // sellingPrice: { type: Number, required: true },
  // discount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);
