const express = require('express');
const router = express.Router();
const service = require('../services/service'); 


router.post('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, age } = req.body;

        if (!name || !email || !age) {
            return res.status(400).json({ message: "Missing required fields: name, email, age." });
        }

        const updatedUser = await service.addEmployee(req.body, id);
        res.status(200).json({
            message: "User created successfully.",
            user: updatedUser,
        });
    } catch (error) {
        next(error);
    }
});


router.get('/', async (req, res, next) => {
    try {
        const employees = await service.getAllEmployee();
        res.status(200).json(employees);
    } catch (error) {
        next(error);
    }
});


router.get('/:id', async (req, res, next) => {
    try {
        const employee = await service.getEmployeeById(req.params.id);
        res.status(200).json(employee);
    } catch (error) {
        next(error);
    }
});


router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, age } = req.body;

        if (!name || !email || !age) {
            return res.status(400).json({ message: "Missing required fields: name, email, age." });
        }

        const updatedUser = await service.EditEmployee(req.body, id);
        res.status(200).json({
            message: "User updated successfully.",
            user: updatedUser,
        });
    } catch (error) {
        next(error);
    }
});




router.delete('/:id', async (req, res, next) => {
    try {
        const result = await service.deleteEmployee(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
