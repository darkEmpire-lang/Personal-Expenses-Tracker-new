import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
  }

  token = token.split(" ")[1]; 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error("Token Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

export default authUser;
