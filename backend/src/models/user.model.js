import mongoose from "mongoose";


const schema= new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true,
        },
        fullName:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
            minLength:8,
        },
        profilePic:{
            type:String,
            default:null,
        }
    },
    {timestamps:true}
);

const User=mongoose.model("User",schema);

export default User;