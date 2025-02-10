const db = require("../services/Db");

/**
 * Adds a new employee
 */
module.exports.AddEmployee = async (req, res, next) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email || !age) {
      return res.status(400).json({ message: "Missing required fields: name, email, age." });
    }
    const result = await db.query("INSERT INTO users (name, email, age) VALUES (?, ?, ?)", [name, email, age]);
    const newUserId = result[0].insertId;
    const [[newUser]] = await db.query("SELECT * FROM users WHERE id = ?", [newUserId]);
    res.status(201).json({ message: "Employee created successfully.", user: newUser });
  } catch (error) {
    console.error("Error in addNewEmployee:", error);
    next({ status: 500, message: "Failed to add employee." });
  }
};

/**
 * Fetches all employees
 */
module.exports.GetAllEmployees = async (req, res, next) => {
  try {
    const [records] = await db.query("SELECT * FROM users");
    res.status(200).json(records);
  } catch (error) {
    console.error("Error in getAllEmployees:", error);
    next({ status: 500, message: "Failed to fetch employees." });
  }
};

/**
 * Fetches a single employee by ID
 */
module.exports.GetEmployeeById = async (req, res, next) => {
  try {
    const [[record]] = await db.query("SELECT * FROM users WHERE id = ? ", [req.params.id]);
    if (!record) {
      return res.status(404).json({ message: `Employee not found with id: ${req.params.id}` });
    }
    res.status(200).json(record);
  } catch (error) {
    console.error("Error in getEmployeeById:", error);
    next({ status: 500, message: "Failed to fetch employee." });
  }
};

/**
 * Edits an employee's details 
 */
module.exports.EditEmployee = async (req, res, next) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email || !age) {
      return res.status(400).json({ message: "Missing required fields: name, email, age." });
    }
    await db.query("CALL new_procedure(?,?,?,?)", [req.params.id, name, email, age]);
    const [[updatedUser]] = await db.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to fetch updated employee." });
    }
    res.status(200).json({ message: "Employee updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Error in editEmployee:", error);
    next({ status: 500, message: "Failed to update employee." });
  }
};

/**
 * Deletes an employee from the database
 */
module.exports.DeleteEmployee = async (req, res, next) => {
  try {
    const [{ affectedRows }] = await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    if (affectedRows === 0) {
      return res.status(404).json({ message: `Employee not found with id: ${req.params.id}` });
    }
    const [remainingUsers] = await db.query("SELECT * FROM users WHERE is_deleted = 0");
    res.status(200).json({ message: "Employee deleted successfully.", remainingData: remainingUsers });
  } catch (error) {
    console.error("Error in deleteEmployee:", error);
    next({ status: 500, message: "Failed to delete employee." });
  }
};
