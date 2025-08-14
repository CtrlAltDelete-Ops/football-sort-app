const form = document.querySelector("form");
const inputName = document.getElementById("name");
const inputShooting = document.getElementById("shooting");
const inputPassing = document.getElementById("passing");
const inputDribbling = document.getElementById("dribbling");
const inputDefending = document.getElementById("defending");
const inputAttacking = document.getElementById("attacking");
const leadershipCheckbox = document.querySelector(
	'.leadership input[type="checkbox"]'
);
const submitButton = document.querySelector('button[type="submit"]');
const playerList = document.querySelector(".player-list");
const player_management_content = document.querySelector(
	".player-management-content"
);
const players = document.querySelectorAll(".player");
const add_player_button = document.getElementById("add-player-btn");
const add_icon = document.querySelector("button i");
const generateTeamsButton = document.querySelector(".gen-teams");
const teamsContainer = document.querySelector(".teams");
const numberOfTeams = document.getElementById("number-of-teams");
const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const deleteButtons = document.querySelectorAll(".delete");

// Fetch players when the page loads
document.addEventListener("DOMContentLoaded", () => {
	teamsContainer.innerHTML = "";
	fetchPlayers();
});

add_player_button.addEventListener("click", () => {
	console.log("added");
	player_management_content.classList.toggle("hidden");
	add_icon.classList.toggle("fa-plus");
	add_icon.classList.toggle("fa-minus");
});

form.addEventListener("submit", (e) => {
	e.preventDefault();
	createPlayer();
	form.reset();
	player_management_content.classList.add("hidden");
});

playerList.addEventListener("click", (e) => {
	if (e.target.classList.contains("delete") || e.target.closest(".delete")) {
		const playerElement = e.target.closest(".player");
		const playerId = playerElement.getAttribute("data-id");
		if (confirm("Are you sure you want to delete this player?")) {
			deletePlayer(playerId);
		}
	}
});

//incrementing and decrementing number of teams
if (parseInt(numberOfTeams.textContent) <= 2) {
	downButton.disabled = true;
}

upButton.addEventListener("click", () => {
	const currentNumber = parseInt(numberOfTeams.textContent);
	numberOfTeams.innerText = currentNumber + 1;

	if (parseInt(numberOfTeams.textContent) > 2) {
		downButton.disabled = false;
	}
});

downButton.addEventListener("click", () => {
	const currentNumber = parseInt(numberOfTeams.textContent);
	if (currentNumber > 2) {
		numberOfTeams.innerText = currentNumber - 1;
	}

	if (parseInt(numberOfTeams.textContent) <= 2) {
		downButton.disabled = true;
	}
});

//generating teams
generateTeamsButton.addEventListener("click", () => {
	generateTeams();
});

//creating players and saving them to the database
function createPlayer() {
	const playerData = {
		name: inputName.value.trim(),
		shooting: parseInt(inputShooting.value, 10),
		passing: parseInt(inputPassing.value, 10),
		dribbling: parseInt(inputDribbling.value, 10),
		defending: parseInt(inputDefending.value, 10),
		attacking: parseInt(inputAttacking.value, 10),
		leadership: leadershipCheckbox.checked,
	};

	const token =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODViZjExMTY4Mzg1ZGYwYzMwZTNkZmIiLCJpYXQiOjE3NTQ3Mjg5OTAsImV4cCI6MTc1NTMzMzc5MH0.H6rhd30bANxSYbAmMpGnyvayHT3FepS3-h3t8m7keMs";

	axios
		.post("http://localhost:5050/players", playerData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		.then((response) => {
			console.log("Player created successfully:", response.data);
			const newPlayer = document.createElement("div");
			newPlayer.classList.add("player");
			newPlayer.setAttribute("data-id", response.data._id);
			newPlayer.innerHTML = `
        <div class="profile">
            <div class="icon"><i class="fas fa-user"></i></div>
        </div>
        <div class="player-details">
            <h3 class="name">${playerData.name}</h3>
            <p class="attacking-power">Attacking Power: <span>${playerData.attacking}</span></p>
            <p class="defending-power">Defending Power: <span>${playerData.defending}</span></p>
            <div class="delete-player-container">
                    <button class="delete btn"><i class="fa-solid fa-plus"></i></button>
                </div>
        </div>
    `;

			playerList.appendChild(newPlayer);
		})
		.catch((error) => {
			console.error("Error creating player:", error);
			alert("Failed to create player! Please check the console for details.");
		});
}

function deletePlayer(playerId) {
	const token =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODViZjExMTY4Mzg1ZGYwYzMwZTNkZmIiLCJpYXQiOjE3NTQ3Mjg5OTAsImV4cCI6MTc1NTMzMzc5MH0.H6rhd30bANxSYbAmMpGnyvayHT3FepS3-h3t8m7keMs";

	axios
		.delete(`http://localhost:5050/players/${playerId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		.then((response) => {
			console.log("Player deleted successfully:", response.data);
			const playerElement = document.querySelector(
				`.player[data-id="${playerId}"]`
			);
			if (playerElement) {
				playerElement.remove();
			}
		})
		.catch((error) => {
			console.error("Error deleting player:", error);
			alert("Failed to delete player! Please check the console for details.");
		});
}

function fetchPlayers() {
	playerList.innerHTML = '<h3 class="sec-title">Player List</h3>';
	const token =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODViZjExMTY4Mzg1ZGYwYzMwZTNkZmIiLCJpYXQiOjE3NTQ3Mjg5OTAsImV4cCI6MTc1NTMzMzc5MH0.H6rhd30bANxSYbAmMpGnyvayHT3FepS3-h3t8m7keMs";

	axios
		.get("http://localhost:5050/players", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		.then((response) => {
			const players = response.data;
			if (response.status === 404 || !players.length) {
				playerList.innerHTML = '<h3 class="sec-title">No Players Found</h3>';
				return;
			}
			console.log("players fetched successfully:", response);
			document.createElement("div");
			players.forEach((player) => {
				const newPlayer = document.createElement("div");
				newPlayer.classList.add("player");
				newPlayer.setAttribute("data-id", player._id);
				newPlayer.innerHTML = `
                <div class="profile">
                    <div class="icon"><i class="fas fa-user"></i></div>
                </div>
                <div class="player-details">
                    <h3 class="name">${player.name}</h3>
                    <p class="attacking-power">Attacking Power: <span>${player.attacking}</span></p>
                    <p class="defending-power">Defending Power: <span>${player.defending}</span></p>
                </div>
                <div class="delete-player-container">
                    <button class="delete btn"><i class="fa-solid fa-plus"></i></button>
                </div>
            `;
				playerList.appendChild(newPlayer);
			});
		})
		.catch((error) => {
			console.error("Error fetching players:", error.message);
		});
}

function generateTeams() {
	const token =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODViZjExMTY4Mzg1ZGYwYzMwZTNkZmIiLCJpYXQiOjE3NTQ3Mjg5OTAsImV4cCI6MTc1NTMzMzc5MH0.H6rhd30bANxSYbAmMpGnyvayHT3FepS3-h3t8m7keMs";
	const TeamsNumber = numberOfTeams.textContent;

	axios
		.get(`http://localhost:5050/players/teams/${TeamsNumber}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		.then((response) => {
			console.log("Teams generated successfully:", response.data);
			const teams = response.data;
			const teamNames = [
				"A",
				"B",
				"c",
				"D",
				"E",
				"F",
				"G",
				"H",
				"I",
				"J",
				"K",
				"L",
				"M",
				"N",
				"O",
				"P",
				"Q",
				"R",
				"S",
			];
			teamsContainer.innerHTML = "";

			teams.forEach((team, idx) => {
				const teamDiv = document.createElement("div");
				teamDiv.classList.add("team");
				teamDiv.innerHTML = `
                    <h4 class="team-name">Team ${teamNames[idx]}</h4>
                    <div class="team-content ${idx + 1}">
                    </div>
                `;
				teamsContainer.appendChild(teamDiv);

				for (let i = 1; i < team.length; i++) {
					const teamPlayer = `
                        <div class="player">
                            <div class="profile">
                                <div class="icon"><i class="fas fa-user"></i></div>
                            </div> 
                            <div class="player-details">
                                <h3 class="name">${team[i].name}</h3>
                                <p class="attacking-power">Attacking Power: <span>${team[i].attacking}</span></p>
                                <p class="defending-power">Defending Power: <span>${team[i].defending}</span></p>
                            </div>
                        </div>
                    `;
					const teamContent = teamDiv.querySelector(".team-content");
					teamContent.innerHTML += teamPlayer;
				}
			});
		})
		.catch((error) => {
			console.error("Error generating teams:", error);
			alert("Failed to generate teams! Please check the console for details.");
		});
}
