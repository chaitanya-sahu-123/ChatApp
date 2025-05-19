import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";


export const getUsersForSidebar = async (req,res) =>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password")
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Get users for sidebar controller error:",error.message);
        res.status(500).json({message:"Something went wrong"});
    }
}

export const getMessages = async (req,res) =>{
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Get messages controller error:",error.message);
        res.status(500).json({message:"Something went wrong"});
    }
}

export const sendMessage = async (req,res) =>{
    try {
        const {text,image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            const uploadres= await cloudinary.uploader.upload(image);
            imageUrl = uploadres.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });

        await newMessage.save();
        // Real Time communication using socket.io
        const receiverSocketId=getRecieverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage',newMessage)
        }
        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Send message controller error:",error.message);
        res.status(500).json({message:"Something went wrong"});
    }
}