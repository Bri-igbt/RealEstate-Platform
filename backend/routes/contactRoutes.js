import express from 'express'
import { createContact, getAllContacts } from '../controllers/contactController.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';

const contactRouter = express.Router()

contactRouter.post("/", createContact);
contactRouter.get("/", protect, authorize("admin"), getAllContacts);

export default contactRouter;