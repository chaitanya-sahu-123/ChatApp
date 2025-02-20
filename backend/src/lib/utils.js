import jwt from 'jsonwebtoken';



export const genToken = (userId,res)=>{
    const token= jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: "7d",
        reAuthenticate: true
    })
    res.cookie('jwt',token,{
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        withCredentials: true,
        secure:process.env.NODE_ENV !== "development"
    });
    // res.status(200).json({ message: "Cookie set successfully" });
    return token;
}