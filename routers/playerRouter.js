const express = require('express');
const playerController = require('../controllers/playerController');
const auth = require('../middleware/auth'); 

const router = express.Router();

router.post('/', auth, playerController.createPlayer);
router.get('/', auth, playerController.getPlayers);
router.get('/:id', auth, playerController.getPlayerById);
router.patch('/:id', auth, playerController.updatePlayer);
router.delete('/:id', auth, playerController.deletePlayer);
router.delete('/', auth, playerController.deleteAllPlayers);

module.exports = router;
