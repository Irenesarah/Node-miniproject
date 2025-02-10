const express = require("express");
const employeeHandler = require("../services/service"); 

const router = express.Router();


router.post("/", employeeHandler.AddEmployee);        
router.get("/", employeeHandler.GetAllEmployees);      
router.get("/:id", employeeHandler.GetEmployeeById);    
router.put("/:id", employeeHandler.EditEmployee);       
router.delete("/:id", employeeHandler.DeleteEmployee);  

module.exports = router;
