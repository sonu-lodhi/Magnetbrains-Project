const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); 

const router = express.Router();

router.post("/register", async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 12);
  
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });
  
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error saving user:", error); 
      res.status(500).json({ message: "Server error login1" });
    }
  });
  
console.log(req.body);

module.exports = router;
