const UserRole = require("../models/UserRoleModel");

const checkPermission = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || !user.roleId) {
      return res.status(403).json({ error: "Access Denied. No Role Assigned." });
    }

    const role = await UserRole.findById(user.roleId);
    if (!role) {
      return res.status(403).json({ error: "Role not found" });
    }

    let requestPath = req.originalUrl.split("?")[0];
    const requestedPermission = `${req.method.toUpperCase()} ${requestPath}`;

    const isMatch = role.permissions.some((permission) => {
      let [method, storedPath] = permission.split(" ");
      storedPath = storedPath.replace(/\/$/, "");
      requestPath = requestPath.replace(/\/$/, "");

      const storedParts = storedPath.split("/");
      const requestParts = requestPath.split("/");

      if (storedParts.length !== requestParts.length) return false;

      const modifiedStoredPath = storedParts
        .map((part, i) => (part.startsWith(":") ? requestParts[i] : part))
        .join("/");

      return method === req.method.toUpperCase() && modifiedStoredPath === requestPath;
    });

    if (!isMatch) {
      return res.status(403).json({ error: "Access Denied. Insufficient permissions." });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = checkPermission;
