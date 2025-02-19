const db = require("../services/Db");

/**
 * Adds a new employee
 */

module.exports.AddProduct = async (req, res, next) => {
  try {
    const { name, price, description, image } = req.body;

    

    const [result] = await db.query(
      "INSERT INTO product (name, price, description, image) VALUES (?, ?, ?, ?)",
      [name, price, description, image]
    );

    if (!result.insertId) {
      return res.status(500).json({ message: "Product creation failed." });
    }

    const [[newProduct]] = await db.query(
      "SELECT * FROM product WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      message: "Product created successfully.",
      product: newProduct
    });
  } catch (error) {
    console.error("Error in Product creation:", error);
    
    res.status(500).json({ message: "Failed to add Product." });
  }
};
  

/**
 * Fetches all employees
 */
module.exports.GetAllProducts = async (req, res, next) => {
  try {
    const [records] = await db.query("SELECT * FROM product");
    res.status(200).json(records);
  } catch (error) {
    console.error("Error in GetAllProducts:", error);
    next({ status: 500, message: "Failed to fetch product." });
  }
};

/**
 * Fetches a single employee by ID
 */
module.exports.GetProductById = async (req, res, next) => {
  try {
    const [[record]] = await db.query("SELECT * FROM product WHERE id = ? ", [req.params.id]);
    if (!record) {
      return res.status(404).json({ message: `product not found with id: ${req.params.id}` });
    }
    res.status(200).json(record);
  } catch (error) {
    console.error("Error in getProductById:", error);
    next({ status: 500, message: "Failed to fetch product." });
  }
};

/*updating product*/
 


module.exports.EditProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const { name, price, description, image } = req.body;

    

    const [result] = await db.query(
      "UPDATE product SET name = ?, price = ?, description = ?, image = ? WHERE id = ?",
      [name, price, description, image, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: "Product update failed." });
    }

    
    const [updatedProduct] = await db.query("SELECT * FROM product WHERE id = ?", [productId]);

    console.log(" Product updated successfully"); 

    res.status(200).json({
      message: "Product updated successfully!",
      product: updatedProduct[0],
    });
  } catch (error) {
    console.error(" Error in Product update:", error);
    res.status(500).json({ message: "Failed to edit Product." });
  }
};



 /* Deletes an employee from the database
 */
module.exports.DeleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    module.exports.EditProduct = async (req, res) => {
      try {
        console.log("Received data:", req.body); // Debug log
    
        const productId = parseInt(req.params.id, 10);
        const { name, price, description, image } = req.body;
    
        if (!name || !price || !description || !image) {
          return res.status(400).json({ message: "All fields are required." });
        }
    
        const query = "UPDATE product SET name=?, price=?, description=?, image=? WHERE id=?";
        const result = await new Promise((resolve, reject) => {
          db.query(query, [name, price, description, image, productId], (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });
    
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Product not found." });
        }
    
        res.status(200).json({ message: "Product updated successfully." });
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: error.message });
      }
    };
    
    const [{ affectedRows }] = await db.query("DELETE FROM product WHERE id = ?", [productId]);
    
    if (affectedRows === 0) {
      return res.status(404).json({ message: `Product not found with id: ${productId}` });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error in DeleteProduct:", error);
    next({ status: 500, message: "Failed to delete product." });
  }
};

