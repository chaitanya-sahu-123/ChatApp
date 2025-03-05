import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


export const protectRoute = async (req,res,next) => {
    // app.use(cookieParser());
    try {
        const token= req.cookies.jwt || req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({message:"Unauthorized Access. Token not provided"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized Access. Token invalid"});
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        req.user=user;
        next();

    } catch (error) {
        console.log("Protect route middleware error:",error.message);
        res.status(500).json({message:"Something went wrong"});
    }
}