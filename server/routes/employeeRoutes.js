const express = require('express');
const controller = require('../controllers/employeeController');
const { validateCreate, validateUpdate } = require('../middleware/employeeValidation');

const router = express.Router();

// Routing only - request handling lives in the controller.

router.get('/', controller.listEmployees);
router.post('/', validateCreate, controller.createEmployee);
router.get('/:id', controller.getEmployee);
router.put('/:id', validateUpdate, controller.updateEmployee);
router.delete('/:id', controller.deleteEmployee);

module.exports = router;
