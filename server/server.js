import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

const app = express();

await connectDB();

app.use(cors({
    origin: ['http://localhost:5173', 'https://car-rental-website-olive-gamma.vercel.app'],
    credentials: true
}));

app.use(express.json());

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