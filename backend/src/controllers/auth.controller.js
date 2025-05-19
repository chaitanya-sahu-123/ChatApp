import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { genToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';


export const signup = async(req,res) => {
    const { fullName,email,password }=req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        if(password.length<8){
            return res.status(400).json({message:"Password must be at least 8 characters"});
        }
        const user = await User.findOne({email});
        if(user) return res.status(400).json({message:"User with this email already exists"});


        // hashing pwd using bcrypt
        const salt=await bcrypt.genSalt(10);
        const hashedPwd=await bcrypt.hash(password,salt);
        const newUser=new User({
            fullName,
            email,
            password:hashedPwd
        });

        if(newUser){
            // generating jwt token
            genToken(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else{
            return res.status(400).json({message:"Invalid user data"});
        }

        
    } catch (error) {
        console.log("Signup controller error:",error.message);
        res.status(500).json({message:"Something went wrong"});
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const isPwdCorrect = await bcrypt.compare(password, user.password);
      if (!isPwdCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      // Generate token and set cookie
      genToken(user._id, res);
      // Respond with user info (do not include the token in JSON since it is in a cookie)
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      });
    } catch (error) {
      console.log("Login controller error:", error.message);
      res.status(500).json({ message: "Something went wrong" });
    }
  };
export const logout = async (req,res) => {
    try {
        res.cookie('jwt',"",{
            maxAge:0
        });
        if(!login){
            return res.status(400).json({message:"No user logged in"});
        }
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log("Logout controller error:",error.message);
        res.status(500).json({message:"Something went wrong"});
    }
}

export const updateProfile = async (req,res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required"});
        }

        const uploadres = await cloudinary.uploader.upload(profilePic);
        const updateduser=await User.findByIdAndUpdate(userId,{profilePic:uploadres.secure_url},{new:true});
        res.status(200).json(updateduser);
    } catch (error) {
        console.log("Update profile controller error:",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}


export const checkAuth = async (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Check auth controller error:",error.message);
        res.status(500).json({message:"Something went wrong"});
    } 
}

