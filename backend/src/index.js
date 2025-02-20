import express from 'express';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import { connectdb } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import messageRoutes from './routes/message.route.js';

const app = express();


app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use('/api/auth',authRoutes);
app.use('/api/message',messageRoutes);
dotenv.config();

app.get('/', (req, res) => {
    res.send('Hello World');
});

const PORT=process.env.PORT;

app.listen(PORT, () => {
    console.log('Server is running on port',PORT);
    connectdb();
});