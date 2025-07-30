// 

const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  permissions: {
    type: [String], // e.g., ['GET_USERS', 'ADD_USER', 'DELETE_USER']
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserRole', userRoleSchema);
