const express = require("express");
const ProductHandler = require("../services/service"); 

const router = express.Router();


router.post("/product", ProductHandler.AddProduct);        
router.get("/product", ProductHandler.GetAllProducts);      
router.get("/product/:id", ProductHandler.GetProductById);    
router.put("/product/:id", ProductHandler.EditProduct);       
router.delete("/product/:id", ProductHandler.DeleteProduct);  

module.exports = router;
