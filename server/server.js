import express from 'express';
import cors from 'cors';
import "dotenv/config";
import { connect } from 'mongoose';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

//Initialize express app
const app = express();

//Connect to MongoDB
await connectDB();


//Middleware


app.use(cors({
    origin: "https://car-rental-website-olive-gamma.vercel.app",
    credentials: true
}));
app.options("/*", cors());
app.use(express.json());


//Routes
app.get('/', (req, res) => {
    res.send('Server is running');
});
app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/bookings', bookingRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});