const Player = require('../models/player');
const _ = require('lodash');

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

const getPlayerById = async (req, res) => {
    const playerId = req.params.id;
    try {
        const player = await Player.findOne({ _id: playerId, owner: req.user._id });
        if (!player) {
            return res.status(404).send({ message: 'Player not found' });
        }
        res.send(player);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch player' });
        console.error(error);
    }
}

const updatePlayer = async (req, res) => {
    const playerId = req.params.id;
    const allowedUpdates = ['name', 'shooting', 'passing', 'dribbling', 'defending', 'leadership', 'attacking', 'team'];
    const updates = _.pick(req.body, allowedUpdates);
    if (Object.keys(updates).length === 0) {
        return res.status(400).send({ error: 'No updates provided' });
    }

    try {
        const player = await Player.findOne({ _id: playerId, owner: req.user._id });
        if (!player) {
            return res.status(404).send({ message: 'Player not found' });
        }
        Object.keys(updates).forEach((update) => player[update] = updates[update]);
        await player.save();
        res.send(player);
    } catch (error) {
        res.status(400).send({ error: error.message });
        console.error(error);
        
    }
}

const deletePlayer = async (req, res) => {
    const playerId = req.params.id;
    try {
        const player = await Player.findOne({ _id: playerId, owner: req.user._id });
        if (!player) {
            return res.status(404).send({ message: 'Player not found' });
        }
        await player.deleteOne();
        res.send({ message: 'Player deleted successfully' });
        res.send(player);
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete player' });
        console.error(error);
    }
}

const deleteAllPlayers = async (req, res) => {
    try {
        const result = await Player.deleteMany({ owner: req.user._id });
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: 'No players found to delete' });
        }
        res.send({ message: `${result.deletedCount} players deleted successfully` });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete players' });
        console.error(error);
    }
}

const getTeamStats = async (req, res) => {
    try {
        const players = await Player.find({ owner: req.user._id, team: req.query.team });
        if (players.length === 0) {
            return res.status(404).send({ message: 'No players found' });
        }

        const stats = {
            totalPlayers: players.length,
            averageShooting: players.reduce((acc, player) => acc + player.shooting, 0) / players.length,
            averagePassing: players.reduce((acc, player) => acc + player.passing, 0) / players.length,
            averageDribbling: players.reduce((acc, player) => acc + player.dribbling, 0) / players.length,
            averageDefending: players.reduce((acc, player) => acc + player.defending, 0) / players.length,
            averageLeadership: players.reduce((acc, player) => acc + player.leadership, 0) / players.length
        };

        res.send(stats);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch player stats' });
        console.error(error);
    }
}

const generateTeams = async (req, res) => {
    try {
        const numberOfTeams = parseInt(req.body.numberOfTeams, 10);
        if (isNan(numberOfTeams) || numberOfTeams < 2) {
            return res.status(400).send({ message: 'Please enter a valid number of teams (minimum 2).' });
        }   
        const user = req.user;
        const players = await Player.find({ owner: user._id });
        if (players.length === 0) {
            return res.status(404).send({ message: 'No players found' });
        }
 
        const teams = [];

        for (let i = 0; i < numberOfTeams; i++) {
            teams.push([]);
}
        
        const skills = ['shooting', 'passing', 'dribbling', 'defending', 'leadership', 'attacking'];
        
        const sortedByShooting = [...players].sort((a, b) => b.shooting - a.shooting);
        const sortedByPassing = [...players].sort((a, b) => b.passing - a.passing);
        const sortedByDribbling = [...players].sort((a, b) => b.dribbling - a.dribbling);
        const sortedByDefending = [...players].sort((a, b) => b.defending - a.defending);
        const sortedByLeadership = [...players].sort((a, b) => b.leadership - a.leadership);
        const sortedByAttacking = [...players].sort((a, b) => b.attacking - a.attacking);

        for (i = 0; i < sortedByShooting.length; i++) {
            const player = sortedByShooting[i];
            const teamIndex = i % numberOfTeams;
            teams[teamIndex].push(player);
        }

        
        
        
        
    } catch (error) {
        
    }
}


module.exports = {
    createPlayer,
    getPlayers,
    getPlayerById,
    updatePlayer,
    deletePlayer,
    deleteAllPlayers,
    getTeamStats,
};