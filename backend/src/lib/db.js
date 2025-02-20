import mongoose from 'mongoose';


export const connectdb= async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected`);
    }
    catch(err){
        console.log('MongoDB connection failed',err);
    }
}