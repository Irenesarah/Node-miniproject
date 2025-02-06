const db = require('./Db');

module.exports.getAllEmployee = async () => {
    try {
        const [records] = await db.query("SELECT * FROM users");
        return records;
    } catch (error) {
        console.error("Error fetching all employees:", error);
        throw { status: 500, message: "Failed to fetch employees." };
    }
};

module.exports.getEmployeeById = async (id) => {
    try {  
        let record = []    
        record = await db.query(
                "SELECT * FROM users WHERE id = ? AND is_deleted = 0", 
                id
            );          
            if (!record || !record[0] || Object.keys(record[0]).length === 0){                             
                throw { 
                    status: 404, 
                    message: "User not found",
                };
            }
            return record[0]
    } catch (error) {
        
        if (error.status) {
            throw error;
        }

        
        throw { status: 500, message: "Failed to fetch employee." };
    }
};




module.exports.deleteEmployee = async (id) => {
    try {
        const [{ affectedRows }] = await db.query(
            "UPDATE users SET is_deleted = 1 WHERE id = ? AND is_deleted = 0", 
            [id]
        );
        if (affectedRows === 0) {
            throw { status: 404, message: `User not found with id: ${id}` };
        }

        
        const [remainingUsers] = await db.query("SELECT * FROM users WHERE is_deleted = 0");

        return {
            message: "User deleted successfully.",
            userId: id,
            remainingData: remainingUsers,
        };
    } catch (error) {
        console.error(`Error deleting employee with id ${id}:`, error);
        if (error.status) throw error;
        throw { status: 500, message: "Failed to delete employee." };
    }
};



module.exports.EditEmployee = async (obj, id) => {
    try {
        console.log(`Executing EditEmployee for id ${id} with data:`, obj);

        
        await db.query("CALL new_procedure(?,?,?,?)", [
            id, 
            obj.name,
            obj.email,
            obj.age,
        ]);

        console.log("Procedure executed successfully.");

        
        const [[updatedUser]] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        if (!updatedUser) {
            throw { status: 500, message: "Failed to fetch updated user." };
        }

        
        return {
            message: "User updated successfully.",
            user: updatedUser,
        };
    } catch (error) {
        console.error("Error in EditEmployee:", error);
        throw { status: error.status || 500, message: error.message || "Database operation failed." };
    }
};

module.exports.addNewEmployee = async (obj) => { 
    try {
        const result = await db.query("INSERT INTO users (name, email, age) VALUES (?, ?, ?)", [obj.name, obj.email, obj.age]);

        const newUserId = result[0].insertId; 

        const [newUser] = await db.query("SELECT * FROM users WHERE id = ?", newUserId); // Fetch the complete user data

        return { user: newUser }; 

    } catch (error) {
        console.error("Error in addNewEmployee:", error);
        throw error; 
    }
};


