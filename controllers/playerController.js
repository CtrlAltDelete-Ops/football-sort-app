const Player = require("../models/player");
const _ = require("lodash");
const { use } = require("../routers/playerRouter");

const isOdd = (n) => {
  return n % 2 !== 0;
};
const isEven = (n) => {
  return n % 2 === 0;
};

const createPlayer = async (req, res) => {
  try {
    const player = new Player({
      ...req.body,
      owner: req.user._id,
    });
    const duplicatePlayer = await Player.findOne({ name: player.name, owner: req.user._id });
    if (duplicatePlayer) {
      return res.status(400).send({ message: "Player with this name already exists" });
    }
    await player.save();
    res.status(201).send(player);
  } catch (error) {
    res.status(400).send({ error: error.message });
    console.error(error);
  }
};

const getPlayers = async (req, res) => {
  try {
    const players = await Player.find({ owner: req.user._id });
    if (players.length === 0) {
      return res.status(404).send({ message: "No players found" });
    }
    res.send(players);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch players" });
    console.error(error);
  }
};

const getPlayerById = async (req, res) => {
  const playerId = req.params.id;
  try {
    const player = await Player.findOne({ _id: playerId, owner: req.user._id });
    if (!player) {
      return res.status(404).send({ message: "Player not found" });
    }
    res.send(player);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch player" });
    console.error(error);
  }
};

const updatePlayer = async (req, res) => {
  const playerId = req.params.id;
  const allowedUpdates = [
    "name",
    "shooting",
    "passing",
    "dribbling",
    "defending",
    "leadership",
    "attacking",
    "team",
  ];
  const updates = _.pick(req.body, allowedUpdates);
  if (Object.keys(updates).length === 0) {
    return res.status(400).send({ error: "No updates provided" });
  }

  try {
    const player = await Player.findOne({ _id: playerId, owner: req.user._id });
    if (!player) {
      return res.status(404).send({ message: "Player not found" });
    }
    Object.keys(updates).forEach(
      (update) => (player[update] = updates[update])
    );
    await player.save();
    res.send(player);
  } catch (error) {
    res.status(400).send({ error: error.message });
    console.error(error);
  }
};

const deletePlayer = async (req, res) => {
  const playerId = req.params.id;
  try {
    const player = await Player.findOne({ _id: playerId, owner: req.user._id });
    if (!player) {
      return res.status(404).send({ message: "Player not found" });
    }
    await player.deleteOne();
    res.send({ message: "Player deleted successfully" });
    res.send(player);
  } catch (error) {
    res.status(500).send({ error: "Failed to delete player" });
    console.error(error);
  }
};

const deleteAllPlayers = async (req, res) => {
  try {
    const result = await Player.deleteMany({ owner: req.user._id });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "No players found to delete" });
    }
    res.send({
      message: `${result.deletedCount} players deleted successfully`,
    });
  } catch (error) {
    res.status(500).send({ error: "Failed to delete players" });
    console.error(error);
  }
};

const getTeamStats = async (req, res) => {
  try {
    const players = await Player.find({
      owner: req.user._id,
      team: req.query.team,
    });
    if (players.length === 0) {
      return res.status(404).send({ message: "No players found" });
    }

    const stats = {
      totalPlayers: players.length,
      averageShooting:
        players.reduce((acc, player) => acc + player.shooting, 0) /
        players.length,
      averagePassing:
        players.reduce((acc, player) => acc + player.passing, 0) /
        players.length,
      averageDribbling:
        players.reduce((acc, player) => acc + player.dribbling, 0) /
        players.length,
      averageDefending:
        players.reduce((acc, player) => acc + player.defending, 0) /
        players.length,
      averageLeadership:
        players.reduce((acc, player) => acc + player.leadership, 0) /
        players.length,
    };

    res.send(stats);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch player stats" });
    console.error(error);
  }
};

const generateTeams = async (req, res) => {
  try {
    const numberOfTeams = parseInt(req.body.numberOfTeams, 10);
    if (isNaN(numberOfTeams) || numberOfTeams < 2) {
      return res
        .status(400)
        .send({ message: "Please enter a valid number of teams (minimum 2)." });
    }
    const user = req.user;
    const players = await Player.find({ owner: user._id });
    if (players.length === 0) {
      return res.status(404).send({ message: "No players found" });
    }
    if (numberOfTeams > players.length) {
      return res
        .status(400)
        .send({
          message: "Number of teams cannot exceed the number of players.",
        });
    }

    const teams = [];
    for (let i = 0; i < numberOfTeams; i++) {
      teams.push([]);
    }

    const weightedAverages = [];
    

    const skills = [
      "shooting",
      "passing",
      "dribbling",
      "defending",
      "leadership",
      "attacking",
    ];

    const weights = {
        shooting: 0.1,
        passing: 0.3,
        dribbling: 0.15,
        defending: 0.2,
        attacking: 0.25,
    };

    players.forEach((player) => {
        skills.forEach((skill) => {
            weightedAverages.push( Math.round(weights[skill] *  player[skill]));
        })
    })

    console.log(weightedAverages);

    const attackingArray = Object.entries(attacking);

    const sortByAttacking = attackingArray.sort((a, b) => b[1] - a[1]);
    const sortedByAttacking = Object.fromEntries(sortByAttacking);

    const defendingArray = Object.entries(defending);
    const sortByDefending = defendingArray.sort((a, b) => b[1] - a[1]);
    const sortedByDefending = Object.fromEntries(sortByDefending);

    const playersSet = new Set(sortByAttacking.map((player) => player[0]));

    function chunkIntoGroupsOfThree(array) {
        const groups = [];
        for (let i = 0; i < array.length; i += 3) {
          groups.push(array.slice(i, i + 3));
        }
        return groups;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }

    function divideArrays(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = j % numberOfTeams;
            
        } 
    }

    const playerMap = new Map(players.map(p => [p.name, p]));

    const attackingGroups = chunkIntoGroupsOfThree(sortByAttacking);
    const defendingGroups = chunkIntoGroupsOfThree(sortByDefending);

    const shuffledAttackingGroups = shuffleArray(attackingGroups);
    const shuffledDefendingGroups = shuffleArray(defendingGroups);
    
    let attack = true;
    for (i = 0; i < shuffledAttackingGroups.length; i++) {
        const attackingGroup = shuffledAttackingGroups[i];
        const defendingGroup = shuffledDefendingGroups[i];
        
        let j =0;
        while (playersSet.size > 0){
            const teamIndex = j % numberOfTeams;
            if (attack && playersSet.has(attackingGroup[j][0])) {
                const playerName = attackingGroup[j][0];
                const player = playerMap.get(playerName);
                teams[teamIndex].push(player);
                playersSet.delete(playerName);
                attack = false;
                j++;
            } else if (!attack && playersSet.has(defendingGroup[j][0])) {
                const playerName = defendingGroup[j][0];
                const player = playerMap.get(playerName);
                teams[teamIndex].push(player);
                playersSet.delete(playerName);
                attack = true;
                j++;
            } else {
                continue;  
            }
        }
    }

    console.log(teams);
    console.log(playersSet);


    let x = 0;
    

  } catch (error) {
    res.status(400).send({ error: error.message });
    console.error(error);
  }
};

module.exports = {
  createPlayer,
  getPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
  deleteAllPlayers,
  getTeamStats,
  generateTeams,
};
