const express = require('express');
const router = express.Router();

const {
  getRoles,
  addRole,
  updateRole,
  deleteRole,
} = require('../controllers/userRoleController');

const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require("../middleware/checkPermission");

router.get('/', authMiddleware, checkPermission, getRoles);
router.post('/add', addRole);
router.put('/edit/:id', authMiddleware, checkPermission, updateRole);
router.delete('/delete/:id', authMiddleware, checkPermission, deleteRole);

module.exports = router;
