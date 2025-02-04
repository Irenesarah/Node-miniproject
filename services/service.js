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
        const [[record]] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        if (!record) {
            throw { status: 404, message: `No record found with id: ${id}` };
        }
        console.log(record); 
        return record;
    } catch (error) {
        console.error(`Error fetching employee with id ${id}:`, error);
        if (error.status) throw error;
        throw { status: 500, message: "Failed to fetch employee." };
    }
};

module.exports.deleteEmployee = async (id) => {
    try {
        const [{ affectedRows }] = await db.query("DELETE FROM users WHERE id = ?", [id]);
        if (affectedRows === 0) {
            throw { status: 404, message: `No record found with id: ${id}` };
        }

        
        const [remainingUsers] = await db.query("SELECT * FROM users");

        return {
            message: "Deleted successfully.",
            userId: id, 
            remainingData: remainingUsers, 
        };
    } catch (error) {
        console.error(`Error deleting employee with id ${id}:`, error);
        if (error.status) throw error;
        throw { status: 500, message: "Failed to delete employee." };
    }
};

module.exports.addEmployee = async (obj, id) => {
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
            
            user: updatedUser,
        };
    } catch (error) {
        console.error("Error in EditEmployee:", error);
        throw { status: error.status || 500, message: error.message || "Database operation failed." };
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



