import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";


const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// user login part 
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

   
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    
    const token = createToken(user._id);
    res.json({
      success: true,
      message: `${user.name} Login successful!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// User registration part 
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

   
    if (password.length < 5) {
      return res.json({ success: false, message: "Please enter a  stronger password" });
    }

   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the new user to the database
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    
    const token = createToken(savedUser._id);

    res.json({
      success: true,
      message: `${savedUser.name} Welcome to Peronal Expense Tracker ,Here make the future Better With Saving money`,
      
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin login 
const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
     
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });

      return res.json({ success: true, message: "Admin login successful", token });
    }

    res.json({ success: false, message: "Invalid Admin credentials" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password"); //password eka denne na api
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

export { loginUser, registerUser, adminlogin,getAllUsers };
