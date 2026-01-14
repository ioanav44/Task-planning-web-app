const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(authMiddleware);

router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.post('/', roleCheck('IT_MANAGER'), taskController.create);
router.put('/:id', roleCheck('IT_MANAGER'), taskController.update);
router.delete('/:id', roleCheck('IT_MANAGER'), taskController.delete);

router.patch('/:id/assign', roleCheck('IT_MANAGER'), taskController.assign);
router.patch('/:id/complete', roleCheck('IT_SPECIALIST'), taskController.complete);
router.patch('/:id/close', roleCheck('IT_MANAGER'), taskController.close);

router.get('/history/:userId', roleCheck('IT_MANAGER'), taskController.getHistory);

module.exports = router;
