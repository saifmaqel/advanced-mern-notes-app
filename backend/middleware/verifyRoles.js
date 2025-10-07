export function verifyRoles(...allowedRoles) {
  return (req, res, next) => {
    const roles = req.roles;

    if (!roles || !Array.isArray(roles)) {
      return res.status(403).json({ message: "Access denied: no roles found" });
    }

    const hasPermission = roles.some((role) => allowedRoles.includes(role));

    if (!hasPermission) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient role" });
    }

    next();
  };
}
