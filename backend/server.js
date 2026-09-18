import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import http from 'http'
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import propertyRouter from './routes/propertyRoutes.js';
import inquiryRouter from './routes/inquiryRoutes.js';
import wishlistRouter from './routes/wishlistRoutes.js';
import contactRouter from './routes/contactRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import chatRouter from './routes/chatRoutes.js';

const app = express();
const PORT = 5000

// DB
connectDB()

// Middleware
const allowedOrigins = [
    "http://localhost:3000",
].filter(Boolean)

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);

        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/property", propertyRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatRouter);

app.get("/",( req, res) => {
    res.send("API WORKING")
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    socket.on("joinChat", (chatId) => {
        socket.join(chatId);
    });

    socket.on("sendMessage", (data) => {
        io.to(data.chatId).emit("recieveMessage", data);
    });

    socket.on("disconnect", () => {

    });
});

server.listen(PORT, () => {
    console.log(`Server Started on http://localhost:${PORT}`);
    
})