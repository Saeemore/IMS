// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   unit: { type: String, enum: ["kg", "litre", "pcs"], required: true },
//   manufacturer: { type: String, required: true },
//   supplier: { type: String, required: true },
//   unitPrice: { type: Number, required: true }
// });

// module.exports = mongoose.model("Product", productSchema);
// 
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  description: {
    type: String,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);