import express from 'express';
import { 
    addProperty, 
    deleteProperty, 
    getAllProperties, 
    getMyProperties, 
    getPropertyCount, 
    getPropertyDetails, 
    getSellerDashboard, 
    updateProperty, 
    updatePropertyStatus
} from '../controllers/propertyController.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const propertyRouter = express.Router();

propertyRouter.get("/", getAllProperties);

// protect the routes that only seller can do hese works
propertyRouter.post("/", protect, authorize("seller"), upload.array("images", 10), addProperty);
propertyRouter.get("/my", protect, authorize("seller"), getMyProperties); 
propertyRouter.put("/:id", protect, authorize("seller"), upload.array("images", 10), updateProperty);
propertyRouter.delete("/:id", protect, authorize("seller"), deleteProperty); 
propertyRouter.patch("/:id/status", protect, authorize("seller"), updatePropertyStatus);
propertyRouter.get("/seller/dashboard", protect, authorize("seller"), getSellerDashboard);
propertyRouter.get("/counts", getPropertyCount);
propertyRouter.get("/:id", getPropertyDetails); 

export default propertyRouter;
