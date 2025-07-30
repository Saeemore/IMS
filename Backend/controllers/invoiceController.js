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
      tax = 0,
      discount = 0,
      paymentStatus
    } = req.body;

    // Calculate totals
    let subTotal = 0;
    for (const item of items) {
      item.totalPrice = item.quantity * item.unitPrice;
      subTotal += item.totalPrice;

      // Reduce inventory stock (optional)
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity }
      });
    }

    const grandTotal = subTotal + tax - discount;

    const newInvoice = new Invoice({
      invoiceNumber,
      customerName,
      customerContact,
      items,
      subTotal,
      tax,
      discount,
      grandTotal,
      paymentStatus
    });

    await newInvoice.save();
    res.status(201).json({ message: 'Invoice created', invoice: newInvoice });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Invoices
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('items.productId', 'name');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('items.productId', 'name');
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update Invoice
exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json({ message: 'Invoice updated', invoice: updatedInvoice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Invoice
exports.deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
