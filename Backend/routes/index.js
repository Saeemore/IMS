const express = require('express');
const router = express.Router();

router.use('/users', require('./userRoutes'));
router.use('/roles', require('./userRoleRoutes'));

module.exports = router;
