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
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require("../middleware/checkPermission");

router.post('/add',authMiddleware,checkPermission , invoiceController.addInvoice);
router.get('/',authMiddleware,checkPermission , invoiceController.getInvoices);
router.get('/:id',authMiddleware,checkPermission , invoiceController.getInvoiceById);
router.put('/:id',authMiddleware,checkPermission , invoiceController.updateInvoice);
router.delete('/:id',authMiddleware,checkPermission , invoiceController.deleteInvoice);

module.exports = router;
