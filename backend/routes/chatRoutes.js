import express from 'express';
import Chat from '../models/chat.model.js';
import { protect } from '../middlewares/authMiddleware.js';

const chatRouter = express.Router();
chatRouter.use(protect);

// TO START A CHAT
chatRouter.post("/start", async (req, res) => {
    try {
        const { propertyId, sellerId, buyerId: providedBuyerId } = req.body;
        let buyerId, finalSellerId;
        if (req.user.role === "seller") {
            buyerId = providedBuyerId;
            finalSellerId = req.user._id;

        } else {
            buyerId = req.user._id;
            finalSellerId = sellerId;
        }

        if (!buyerId || !finalSellerId) {
            return res.status(400).json({
                message: "Missing buyer or seller Id"
            });
        }

        // check for an existing chat between the buyer and seller for this property
        let chat = await Chat.findOne({
            buyer: buyerId,
            seller: finalSellerId,
            property: propertyId
        });

        if (!chat) {
            chat = await Chat.create({
                property: propertyId,
                buyer: buyerId,
                seller: finalSellerId,
                messages: []
            });
        }

        chat = await Chat.findById(chat._id)
            .populate("buyer", "name email profilePic")
            .populate("seller", "name email profilePic")
            .populate("property", "title price images");

        res.json(chat);

    } catch (error) {
        res.status(500).json({
            message: "Error creating chats or getting previous one",
            error: error.message
        });
    }
});

// TO SEND MESSAGE
chatRouter.post("/send", async (req, res) => {
    try {
        const { chatId, text, image } = req.body;
        const userId = req.user.id;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({
            message: "Chat not found"
        });

        if (chat.buyer.toString() !== userId && chat.seller.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized to send messages in this chat"
            });
        }

        const newMessage = {
            sender: userId,
            text,
            image,
            createdAt: new Date()
        };
        chat.messages.push(newMessage);
        await chat.save();

        const savedMessage = chat.messages[chat.messages.length - 1];
        res.json({
            chat,
            newMessage: savedMessage
        });

    } catch (error) {
        res.status(500).json({
            message: "Error sending message",
            error: error.message
        });
    }
});

// TO GET CHATS FOR USER
chatRouter.post("/user", async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({
            $or: [{ buyer: userId }, { seller: userId }]
        })
            .populate("buyer", "name email profilePic")
            .populate("seller", "name email profilePic")
            .populate("property", "title price images")
            .sort({ updatedAt: -1 });

        res.json(chats);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching user chat",
            error: error.message
        });
    }
});

// TO GET CHAT MESSAGES
chatRouter.post("/:chatId", async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId).populate(
            "messages.sender",
            "name profilePic"
        );

        if (!chat) return res.status(404).json({ message: "Chat not found" });
        const userId = req.user._id.toString();
        if (chat.buyer.toString() !== userId && chat.seller.toString() !== userId) {
            return res.status(403).json({
                message: "You are not authorized"
            });
        }

        res.json(chat);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching chat messages",
            error: error.message
        });
    }
});

// TO DELETE AN ENTIRE CHAT
chatRouter.delete("/:chatId", async (req, res) => {
    try {
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);

        if (!chat) return res.status(404).json({ message: "Chat not found" });
        if (
            chat.buyer.toString() !== userId.toString() &&
            chat.seller.toString() !== userId.toString()
        ) {
            return res.status(403).json({ message: "Not Authorized" });
        }
        await Chat.findByIdAndDelete(req.params.chatId);
        res.json({ message: "Chat Deleted Successfully" });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting chat messages",
            error: error.message
        });
    }
});

// TO DELETE A SPECIFIC MESSAGE
chatRouter.delete("/:chatId/message/:messageId", async (req, res) => {
    try {
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        const message = chat.messages.id(req.params.messageId);
        if (!message) return res.status(404).json({ message: "Message not found" });

        // only sender can delete their message
        if (message.sender.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "Not Authorized to delete this message"
            });
        }

        chat.messages.pull(req.params.messageId);
        await chat.save();
        res.json({ message: "Message deleted successfully", chat });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting chat message",
            error: error.message
        });
    }
});

export default chatRouter;