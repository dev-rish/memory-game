const fs = require("fs");
const util = require("util");
const { v4: uuid } = require("uuid");

const { GameSetSize, GAME_DATA_DIR } = require("./constants");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

// Returns a random integer between min & max (both inclusive).
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomCardsSet(difficulty) {
  const cardsSetSize = GameSetSize[difficulty] * 2;

  const cardsSet = [];

  for (let i = 0; i < cardsSetSize - 1; i += 2) {
    const randomData = { color: getRandomColor(), discovered: false };

    cardsSet[i] = randomData;
    cardsSet[i + 1] = randomData;
  }

  return cardsSet.sort(() => Math.random() - 0.5);
}

async function storeGameData(fileId, data) {
  const path = `./${GAME_DATA_DIR}/${fileId}.json`;

  try {
    await writeFile(path, JSON.stringify(data, null, 2));
  } catch (err) {
    throw new Error("Unable to write file:", err.message);
  }
}

async function getGameData(fileId) {
  const path = `./${GAME_DATA_DIR}/${fileId}.json`;

  try {
    const fileContent = await readFile(path);

    const data = JSON.parse(fileContent);

    return data;
  } catch (err) {
    return null;
  }
}

module.exports = {
  getRandomInt,
  getRandomColor,
  generateRandomCardsSet,
  storeGameData,
  getGameData
};
