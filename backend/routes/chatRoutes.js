import Chat from '../models/chat.model.js'
import { protect } from '../middlewares/authMiddleware.js'

chatRouter.use(protect);

// TO CHAT A MESSAGE
chatRouter.post("/start", async (req, res) => {
    try {
        const { propertyId, sellerId, buyerId: providedBuyerId } = req.body;
        let buyerId, finalSellerId;
        if(req.user.role === "seller"){
            buyerId = providedBuyerId;
            finalSellerId = req.user._id;

        } else {
            buyerId = req.user._id;
            finalSellerId = sellerId
        }

        if (!buyerId || !finalSellerId) {
            return res.status(400).json({
                message: "Missing buyer or seller Id"
            })
        }

        // check for an existing chat between the buyer and seller
        let chat = await Chat.findOne({
            buyer: buyerId,
            seller: finalSellerId
        })

        if (!chat) {
            chat = await Chat.create({
                property: propertyId,
                buyer: buyerId,
                seller: finalSellerId,
                message: []
            })
        }

        chat = await Chat.findById(chat._id)
            .populate("buyer", "name email profilePic")
            .populate("seller", "name email profilePic")
            .populate("property", "title price images")
        
        res.json(chat);

    } catch (error) {
        res.status(500).json({
            message: "Error creating chats or getting previous one",
            error: error.message
        })
    }
});

// TO SEND MESSAGE
chatRouter.post("/send", async (req, res) => {
    try {
        const {chatId, text, image} = req.body;
        const userId = req.user.id;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({
            message: "Chat not found"
        })

        if (chat.buyer.toString() !== userId && chat.seller.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized to send messages in this chat"
            })
        }

        const newMessage = {
            sender: userId,
            text,
            image,
            createAt: new Date()
        };
        chat.messages.push(newMessage);
        await chat.save();

        const savedMessage = chat.messages[chat.messages.length - 1];
        res.json({
            chat,
            newMessage: savedMessage
        })

    } catch (error) {
        res.status(500).json({
            message: "Error sending message",
            error: error.message
        })
    }
});

// TO GET CHATS FOR USERS
chatRouter.post("/user", async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({
            $or: [{ buyer: userId}, { seller: userId }]
        })
            .populate("buyer", "name email profilePic")
            .populate("seller", "name email profilePic")
            .populate("property", "title price images")
            .sort({ updatedAt: -1});

        res.json(chats);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching user chat",
            error: error.message
        })
    }
});

// TO GET CHAT MESSAGE
chatRouter.post("/user", async (req, res) => {
    try {
        
    } catch (error) {
        
    }
});


