;
const Invoice = require('../models/invoiceModel');
const Product = require('../models/productModel');

// Add Invoice
exports.addInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      customerName,
      customerContact,
      items,
      paymentStatus = 'Pending'
    } = req.body;

    const TAX_PERCENT = 18;
    const DISCOUNT_PERCENT = 10;

    let subTotal = 0;
    let grandTotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ error: `Product ${item.productId} not found` });

      const basePrice = item.quantity * item.unitPrice;
      const tax = (TAX_PERCENT / 100) * basePrice;
      const discount = (DISCOUNT_PERCENT / 100) * basePrice;
      const totalPrice = basePrice + tax - discount;

      item.totalPrice = totalPrice.toFixed(2); // store with decimals if needed
      item.tax = tax.toFixed(2);
      item.discount = discount.toFixed(2);

      subTotal += basePrice;
      grandTotal += totalPrice;

      // Reduce product stock
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity }
      });
    }

    const newInvoice = new Invoice({
      invoiceNumber,
      customerName,
      customerContact,
      items,
      subTotal: subTotal.toFixed(2),
      tax: (TAX_PERCENT).toFixed(2),
      discount: (DISCOUNT_PERCENT).toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      paymentStatus
    });

    await newInvoice.save();

    res.status(201).json({ message: 'Invoice created successfully', invoice: newInvoice });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Invoices
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('items.productId', 'name');
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('items.productId', 'name');
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Invoice by ID
exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { invoiceNumber } = req.body;

    // Step 1: Check if invoice exists
    const existingInvoice = await Invoice.findById(id);
    if (!existingInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Step 2: Check if same invoiceNumber exists on another record
    if (invoiceNumber) {
      const duplicate = await Invoice.findOne({
        invoiceNumber,
        _id: { $ne: id } // Not the same document
      });

      // if (duplicate) {
      //   return res.status(400).json({ error: 'Invoice number already exists for another record.' });
      // }
    }

    // Step 3: Proceed with update
    const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: 'Invoice updated', invoice: updatedInvoice });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Delete Invoice by ID
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    // Optional: restore stock quantities on delete
    for (const item of invoice.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: item.quantity }
      });
    }

    await invoice.deleteOne();
    res.status(200).json({ message: 'Invoice deleted and stock updated' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Search invoices by invoiceNumber or customerName
exports.searchInvoices = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const invoices = await Invoice.find({
      $or: [
        { invoiceNumber: { $regex: query, $options: 'i' } },
        { customerName: { $regex: query, $options: 'i' } }
      ]
    }).populate('items.productId', 'name');

    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
