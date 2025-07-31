// const express = require('express');
// const router = express.Router();
// const invoiceController = require('../controllers/invoiceController');

// // Optionally: Middleware to check permissions here

// router.post('/invoices/add', invoiceController.addInvoice);
// router.get('/invoices', invoiceController.getInvoices);
// router.get('/invoices/:id', invoiceController.getInvoiceById);
// router.put('/invoices/edit/:id', invoiceController.updateInvoice); // ✅ Edit route
// router.delete('/invoices/delete/:id', invoiceController.deleteInvoice);

// module.exports = router;
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.post('/add', invoiceController.addInvoice);
router.get('/', invoiceController.getInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.put('/edit/:id', invoiceController.updateInvoice);
router.delete('/delete/:id', invoiceController.deleteInvoice);

module.exports = router;
