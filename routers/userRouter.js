const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/profile', auth, userController.getUserProfile);
router.patch('/profile', auth, userController.updateUserProfile);
router.delete('/profile', auth, userController.deleteUserProfile);
router.post('/logout', auth, userController.logoutUser);
router.post('/logoutAll', auth, userController.logoutAllUsers);

module.exports = router;