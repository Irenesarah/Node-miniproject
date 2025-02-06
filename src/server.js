const express = require("express");
/*const bodyparser = require('body-parser');*/
require('express-async-errors');
const db = require("../services/Db");
const employeeRoutes = require('../routes/routes');


const app = express();
const PORT = 3000;


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use("/api/employee", employeeRoutes)
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const status = err.status || 500;
  res.status(status).json({
    status,
    message: err.message || "Internal Server Error",
  });
});

db.query("SELECT 1")
  .then(() => {
    console.log("db connection succeeded")
    app.listen(PORT,
        () => console.log(`server running at http://localhost:${PORT}`));
    })
    .catch((err) => console.log('db connection failed \n'+ err));