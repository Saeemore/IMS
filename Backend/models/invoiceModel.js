// const mongoose = require('mongoose');

// const invoiceSchema = new mongoose.Schema({
//   invoiceNumber: { type: String, required: true, unique: true },
//   customerName: { type: String, required: true },
//   customerContact: String,
//   items: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//       quantity: { type: Number, required: true },
//       unitPrice: { type: Number, required: true },
//       totalPrice: { type: Number, required: true }
//     }
//   ],
//   subTotal: Number,
//   tax: Number,
//   discount: Number,
//   grandTotal: Number,
//   paymentStatus: {
//     type: String,
//     enum: ['Paid', 'Pending', 'Partial'],
//     default: 'Pending'
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Invoice', invoiceSchema);








const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: [true, 'Invoice number is required'],
    // unique: true,
    trim: true
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required']
  },
  customerContact: {
    type: String
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required']
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is required']
      },
      unitPrice: {
        type: Number,
        required: [true, 'Unit price is required']
      },
      totalPrice: {
        type: Number,
        required: [true, 'Total price is required']
      }
    }
  ],
  subTotal: {
    type: Number,
    required: [true, 'Subtotal is required']
  },
  tax: {
    type: Number,
    required: [true, 'Tax is required']
  },
  discount: {
    type: Number,
    default: 0
  },
  grandTotal: {
    type: Number,
    required: [true, 'Grand total is required']
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Partial'],
    default: 'Pending'
  }
}, { timestamps: true }); // replaces createdAt manually

module.exports = mongoose.model('Invoice', invoiceSchema);
