const Player = require('../models/player');
const _ = require('lodash');

const isOdd = (n) => {
    return n % 2 !== 0;
}
const isEven = (n) => {
    return n % 2 === 0;
}

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
        if (isNaN(numberOfTeams) || numberOfTeams < 2) {
            return res.status(400).send({ message: 'Please enter a valid number of teams (minimum 2).' });
        }
        const user = req.user;
        const players = await Player.find({ owner: user._id });
        if (players.length === 0) {
            return res.status(404).send({ message: 'No players found' });
        }
        if (numberOfTeams > players.length) {
            return res.status(400).send({ message: 'Number of teams cannot exceed the number of players.' });
        }

        const teams = [];
        for (let i = 0; i < numberOfTeams; i++) {
            teams.push([]);
        }
        
        const attacking = {};
        const defending = {};
        const chemistry = {};

        const skills = ['shooting', 'passing', 'dribbling', 'defending', 'leadership', 'attacking'];
        
        players.forEach((player) => {
            const attackingAbility = (player.attacking + player.dribbling + player.passing + player.shooting ) / 4
            attacking[player.name] = Number(attackingAbility.toFixed(2));
        })

        players.forEach((player) => {
            const defendingAbility = (player.defending + player.passing ) / 2
            defending[player.name] = Number(defendingAbility.toFixed(2));
        })

        const attackingArray = Object.entries(attacking);

        const sortByAttacking = attackingArray.sort((a, b) => b[1] - a[1]);
        const sortedByAttacking = Object.fromEntries(sortByAttacking);

        const defendingArray = Object.entries(defending);
        const sortByDefending = defendingArray.sort((a, b) => b[1] - a[1]);
        const sortedByDefending = Object.fromEntries(Object.entries(defending).sort((a, b) => b[1] - a[1]));

        let x = 0
        for (let i = 0; i < players.length; i++) {
            const teamIndex = i % numberOfTeams;
            const playerIndex = i % 2;
            const playerName = Object.keys(players)[i];
            const randomIndex = Math.floor(Math.random() * ((i + 2) - i + 1)) + i;
            const playerInTeam = teams.some((team) => {
                team.includes(playerName);
            })

            if (i === 0) {
                teams[teamIndex].push(Object.fromEntries(sortedByAttacking[randomIndex]))
            } else if (isOdd(i) && !playerInTeam) {
                teams[teamIndex].push(Object.fromEntries(sortedByDefending[randomIndex]))
            } else if (isEven(i) && !playerInTeam) {
                teams[teamIndex].push(Object.fromEntries(sortedByAttacking[randomIndex]))
            }
            res.send(randomIndex)
        }
        
    } catch (error) {
        res.status(400).send({ error: error.message });
        console.error(error);
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
    generateTeams
};