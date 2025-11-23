import {
  getAllProducts,
  searchResults,
  addProduct,
} from "../controllers/productController.js";
import express from "express";
import uploadMiddleware from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/add", uploadMiddleware.single("image"), addProduct);
router.get("/products", getAllProducts);
router.get("/search", searchResults);

export default router;
