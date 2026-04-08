import express from 'express';
import "dotenv/config";
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

const app = express();

// Connect DB
await connectDB();

// ✅ CORS (WORKING VERSION — no library issues)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://car-rental-website-olive-gamma.vercel.app");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/bookings', bookingRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});