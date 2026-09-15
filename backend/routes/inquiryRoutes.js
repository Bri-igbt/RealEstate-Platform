import express from 'express'
import { authorize, protect } from '../middlewares/authMiddleware.js';
import { getSellerInquiries, markAsRead, sendInquiry } from '../controllers/inquiryController.js';

const inquiryRouter = express.Router();

inquiryRouter.post("/", protect, authorize("buyer"), sendInquiry);
inquiryRouter.post("/seller", protect, authorize("seller"), getSellerInquiries);
inquiryRouter.post("/:id/read", protect, markAsRead); 

export default inquiryRouter;