const express = require('express');
const router = require('../routes/routes'); 
const { addEmployee, getAllEmployee, EditEmployee, deleteEmployee } = require('../services/service');


router.post('/', addEmployee);
router.get('/',getAllEmployee);
router.get('/:id',getAllEmployee);
router.put('/',EditEmployee);
route.delete('/',deleteEmployee);


module.exports = router;
