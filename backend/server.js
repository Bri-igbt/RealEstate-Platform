import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import http from 'http'
import { connectDB } from './config/db.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import propertyRouter from './routes/propertyRoutes.js';
import inquiryRouter from './routes/inquiryRoutes.js';
import wishlistRouter from './routes/wishlistRoutes.js';
import contactRouter from './routes/contactRoutes.js';
import adminRouter from './routes/adminRoutes.js';

const app = express();
const PORT = 5000

// DB
connectDB()

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/property", propertyRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRouter);

app.get("/",( req, res) => {
    res.send("API WORKING")
});

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server Started on http://localhost:${PORT}`);
    
})