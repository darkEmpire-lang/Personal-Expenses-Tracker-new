import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
   //token eka extract krnnva
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.json({ success: false, message: "Not Authorized. Login Again." });
    }

    //  token EKA verify ktnva
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    if (decoded.role !== "admin") {
      return res.json({ success: false, message: "Not Authorized. Admins Only." });
    }

   
    next();
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Invalid or Expired Token." });
  }
};

export default adminAuth;
