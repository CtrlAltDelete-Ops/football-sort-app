const Player = require('../models/player');

const createPlayer = async (req, res) => {
    try {
        const player = new Player({
            ...req.body,
            owner: req.user._id
        });
        await player.save();
        res.status(201).send(player);
    } catch (error) {
        res.status(400).send({ error: error.message });
        console.error(error);
    }
}

const getPlayers = async (req, res) => {
    try {
        const players = await Player.find({ owner: req.user._id });
        if (players.length === 0) {
            return res.status(404).send({ message: 'No players found' });
        }
        res.send(players);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch players' });
        console.error(error);
    }
}

