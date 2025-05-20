import express from 'express';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import { connectdb } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import messageRoutes from './routes/message.route.js';
import {app,server} from './lib/socket.js';
import path from 'path';

// const app = express();
import './lib/cloudinary.js';
dotenv.config();


const __dirname=path.resolve();

app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);

// app.get('/', (req, res) => {
//     res.send('ChatApp Backend');
// });

const PORT=process.env.PORT;

if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname,'../frontend/dist')));

  app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'../frontend','dist','index.html'))
  })
}

server.listen(PORT, () => {
    console.log('Server is running on port',PORT);
    connectdb(); 
});