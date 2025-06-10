//     while (Array.from(playersSet).length !== 0) {
//       let condition = false;
//       const teamIndex = i % numberOfTeams;
//       const band = sortByAttacking.slice(x, x + 3).filter(([name]) => playersSet.has(name));
//         if (band.length === 0) {
//         x += 3;
//         continue;
//         }
//         playerName = band[Math.floor(Math.random() * band.length)][0];

//       let playerName = "";
//       if (i === 0 || isEven(i)) {
//         playerName = sortByAttacking[randomIndex][0];
//       } else {
//         playerName = sortByDefending[randomIndex][0];
//       }

//       if (!playerName) {
//         x++
//         continue;
//       }

//       const playerInTeam = teams.some((team) => {
//         return team.some((member) => {
//           return member.name === playerName;
//         })
//       });


//       if (i === 0) {
//         const player = players.find(p => p.name === playerName);
//         teams[teamIndex].push(player);
//         playersSet.delete(playerName);
//         n++
//       } else if (isOdd(i) && !playerInTeam) {
//         const player = players.find(p => p.name === playerName);
//         teams[teamIndex].push(player);
//         playersSet.delete(playerName);
//         n++
//       } else if (isEven(i) && !playerInTeam) {
//         const player = players.find(p => p.name === playerName);
//         teams[teamIndex].push(player);
//         playersSet.delete(playerName);
//         n++
//       } else if (playerInTeam) {
//         condition = true;
//         i--
//       }

//       if ((n + 1) % 3 === 0 && condition) {
//         x = x + 3;
//       }
//     i++
    
//     // res.send(teams);
//     }
//     console.log(teams);

// const brainRot = true + true + true;
// console.log(true === 1);
// console.log(brainRot);