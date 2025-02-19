const db = require("./services/Db");
const { products } = require("./Data/product");



const insertProduct = async () => {
    const query =
      "INSERT INTO product (name, price, description, image) VALUES ?";
    
    const values = products.map((product) => [
      product.name,
      product.price,
      product.description,
      product.image,
    ]);
  
    try {
      await new Promise((resolve, reject) => {
        db.query(query, [values], (err, result) => {
          if (err) {
            reject("Error inserting products: " + err.message);
          } else {
            console.log("All products inserted successfully!");
            resolve();
          }
        });
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  insertProduct();
  