const {
  fetchAllPlayers,
  fetchSinglePlayer,
  addNewPlayer,
  removePlayer,
} = require("./script");

describe("fetchAllPlayers", () => {
  // Make the API call once before all the tests run
  let allPlayers;
  beforeAll(async () => {
    allPlayers = await fetchAllPlayers();
  });

  test("returns an array", async () => {
    expect(Array.isArray(allPlayers)).toBe(true);
  });

  test("returns players with name and id", async () => {
    allPlayers.forEach((player) => {
      expect(player).toHaveProperty("name");
      expect(player).toHaveProperty("id");
    });
  });
});

// TODO: Tests for `fetchSinglePlayer`

describe("fetchSinglePlayer", () => {
  let singlePlayer;
  const API_URL = "https://fsa-puppy-bowl.herokuapp.com/api/2309-FSA-ET-WEB-FT-SF"

  async function fetchIds() {
    const response = await fetch(API_URL + "/players");
    const json = await response.json();
    const players = json.data.players;
    const randomId = players[Math.floor(Math.random() * players.length)].id;
    return randomId;
  }

  beforeAll(async () => {
    const playerId = await fetchIds();
    singlePlayer = await fetchSinglePlayer(playerId);
  });

  test("returns an object", async () => {
    expect(typeof singlePlayer).toBe("object");
  });

  test("returns 1 player with individual info (name, breed, image)", async () => {
    expect(fetchSinglePlayer.length).toBe(1);
    expect(singlePlayer).toHaveProperty("player.name");
    expect(singlePlayer).toHaveProperty("player.breed");
    expect(singlePlayer).toHaveProperty("player.imageUrl");
  });
});

// TODO: Tests for `addNewPlayer`

describe("addNewPlayer", () => {
  let allPlayers;
  beforeAll(async () => {
    allPlayers = await fetchAllPlayers();
  });

  test("is a function", function () {
    expect(typeof addNewPlayer).toBe("function");
  });

  // tests whether the API's length (total number of players) increased by 1
  test("length of all players increased by 1", async () => {
    expect(allPlayers.length + addNewPlayer.length).toBe(allPlayers.length + 1);
  });
});


// (Optional) TODO: Tests for `removePlayer`

describe("removePlayer", () => {
  let allPlayers;
  beforeAll(async () => {
    allPlayers = await fetchAllPlayers();
  });

  test("is a function", function () {
    expect(typeof removePlayer).toBe("function");
  });

  // tests whether the API's length (total number of players) decreased by 1
  test("length of all players decreased by 1", async () => {
    expect(allPlayers.length - removePlayer.length).toBe(allPlayers.length - 1);
  });
});
