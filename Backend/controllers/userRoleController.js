// 
const UserRole = require('../models/UserRoleModel');

// Add Role
// exports.addRole = async (req, res) => {
//   try {
//     const { roleName , permissions } = req.body;

//     // Validate input
//     if (!roleName || roleName.trim() === '') {
//       return res.status(400).json({ error: 'Role name is required' });
//     }

//     // Check for duplicates
//     const existingRole = await UserRole.findOne({ roleName: roleName.trim() });
//     if (existingRole) {
//       return res.status(409).json({ error: 'Role already exists' });
//     }

//     // Create and save the new role
//     const role = new UserRole({ roleName: roleName.trim() });
//     await role.save();

//     res.status(201).json({ message: 'Role created successfully', role });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
  
// };

// Add Role
exports.addRole = async (req, res) => {
  try {
    const { roleName, permissions } = req.body;

    // Validate input
    if (!roleName || roleName.trim() === '') {
      return res.status(400).json({ error: 'Role name is required' });
    }

    // Check for duplicates
    const existingRole = await UserRole.findOne({ roleName: roleName.trim() });
    if (existingRole) {
      return res.status(409).json({ error: 'Role already exists' });
    }

    // Create and save the new role with permissions
    const role = new UserRole({
      roleName: roleName.trim(),
      permissions: permissions || [] // this line was missing in your original code
    });

    await role.save();

    res.status(201).json({ message: 'Role created successfully', role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Get All Roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await UserRole.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRole = await UserRole.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedRole);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Role
exports.deleteRole = async (req, res) => {
  try {
    await UserRole.findByIdAndDelete(req.params.id);
    res.json({ message: 'Role deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
