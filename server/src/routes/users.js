const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(authMiddleware);

router.get('/', roleCheck('ADMINISTRATOR'), userController.getAll);
router.get('/specialists', roleCheck('IT_MANAGER', 'ADMINISTRATOR'), userController.getSpecialists);
router.get('/:id', roleCheck('ADMINISTRATOR'), userController.getById);
router.post('/', roleCheck('ADMINISTRATOR'), userController.create);
router.put('/:id', roleCheck('ADMINISTRATOR'), userController.update);
router.delete('/:id', roleCheck('ADMINISTRATOR'), userController.delete);

module.exports = router;
