// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/2309-FSA-ET-WEB-FT-SF`;

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(API_URL + `/players`)
    const json = await response.json();
    return json.data.players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(API_URL + `/players/${playerId}`);
    const json = await response.json();
    return json.data;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};


// Fetch the different teams from the API.
async function fetchTeams() {
  try {
    const response = await fetch(API_URL + `/teams`);
    const json = await response.json();
    return json.data;
  } catch (err) {
    console.error(`Oh no, trouble fetching teams!`, err);
  }
}


/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  const newPlayerForm = document.getElementById("new-player-form");
  try {
    const response = await fetch((API_URL + `/players`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newPlayerForm.nameInput.value,
        breed: newPlayerForm.breedInput.value,
        imageUrl: newPlayerForm.imageInput.value,
        teamId: (Math.floor(Math.random() * (358-357 + 1 )) + 357),
      }),
    });

    const json = await response.json();

    if (json.error) {
      throw new Error(json.message);
    }


    //clears the inputs
    newPlayerForm.nameInput.value = ``;
    newPlayerForm.breedInput.value = ``;
    newPlayerForm.imageInput.value = ``;
    
    init();

  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Player could not be deleted.");
    }
    init();
  } catch (err) {
    console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  const mainElement = document.querySelector(`main`);
  const sectionElement = document.createElement(`section`);
  mainElement.append(sectionElement);


  if (!playerList.length) {
    mainElement.innerHTML = `<p>No players available.</p>`;
    return;
  }

  const playerCard = playerList.map((player) => {
    const cardBoxes = document.createElement(`div`);
    cardBoxes.classList.add("cards");

    const p = document.createElement("p");
    p.innerHTML = `
    <h1>Player Name:</h1> 
    <h2>${player.name}</h2>
    <p><b>Player ID:</b>${player.id}</p>
    <img src="${player.imageUrl}" alt="${player.name}" />
    <br>
    <br>
    `
    cardBoxes.replaceChildren(p);

    const detailsButton = document.createElement("button");
    detailsButton.innerHTML = `See details`;
    p.append(detailsButton);
    detailsButton.addEventListener(`click`, () => {
      renderSinglePlayer(player);
      const newPlayerForm = document.getElementById("new-player-form");
      newPlayerForm.innerHTML = `Say hello to ${player.name}!`;
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = `Remove from roster`;
    p.append(deleteButton);
    deleteButton.addEventListener(`click`, () => {
      mainElement.innerHTML = ``;
      removePlayer(player.id);
    });

    return cardBoxes;

  });

  sectionElement.replaceChildren(...playerCard);

};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = async (player) => {
  const mainElement = document.querySelector(`main`);
  const p = document.createElement("p");
  const cardBoxes = document.createElement(`div`);
  cardBoxes.classList.add("cards");
  const sectionElement = document.createElement(`section`);


  let teamName = `Unassigned`;

  if (player.teamId) {
    const response = await fetchTeams();
    const teams = response.teams;
    let matchingTeamIds = teams.find((team) => player.teamId === team.id);
    if (matchingTeamIds) {
      teamName = matchingTeamIds.name;
    }
  }

  p.innerHTML = `
      <h1>Player Name:</h1>
      <h2> ${player.name}</h2>
      <p><b>Player ID:</b>${player.id} </p>
      <p><b>Player Breed:</b>${player.breed}</p>
      <p><b>Player Team:</b>${teamName} </p>
      <img src="${player.imageUrl}" alt="${player.name}" />
      `

  const backToAll = document.createElement("button");
  backToAll.innerHTML = `Back to all players`;
  p.append(backToAll);
  backToAll.addEventListener(`click`, () => {
    mainElement.innerHTML = ``;
    init();
    const newPlayerForm = document.getElementById("new-player-form");
    newPlayerForm.innerHTML = ``;
    renderNewPlayerForm();
  });

  mainElement.replaceChildren(sectionElement);
  sectionElement.replaceChildren(cardBoxes);
  cardBoxes.replaceChildren(p);
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    const newPlayerForm = document.getElementById("new-player-form");
    const mainElement = document.querySelector(`main`);

    const nameLabel = document.createElement("label");
    nameLabel.innerHTML = `Name:`;
    newPlayerForm.append(nameLabel);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "nameInput";
    newPlayerForm.append(nameInput);

    const breedLabel = document.createElement("label");
    breedLabel.innerHTML = `Breed:`;
    newPlayerForm.append(breedLabel);

    const breedInput = document.createElement("input");
    breedInput.type = "text";
    breedInput.name = "breedInput";
    newPlayerForm.append(breedInput);

    const imageLabel = document.createElement("label");
    imageLabel.innerHTML = `Image URL:`;
    newPlayerForm.append(imageLabel);

    const imageInput = document.createElement("input");
    imageInput.type = "text";
    imageInput.name = "imageInput";
    newPlayerForm.append(imageInput);

    const submitButton = document.createElement("button");
    submitButton.innerHTML = `Add New Player`
    newPlayerForm.append(submitButton);

    submitButton.addEventListener(`click`, (event) => {
      event.preventDefault();
      addNewPlayer();
      mainElement.innerHTML = ``;
    })
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

renderNewPlayerForm();

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}
