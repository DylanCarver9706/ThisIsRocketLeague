const adminAuth = (req, res, next) => {
  const adminKey = process.env.ADMIN_KEY;

  if (!adminKey) {
    return res.status(500).json({
      success: false,
      message: "Admin key not configured",
    });
  }

  const providedKey = req.headers["x-admin-key"] || req.query.adminKey;

  if (!providedKey || providedKey !== adminKey) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin key",
    });
  }

  next();
};

module.exports = adminAuth;
