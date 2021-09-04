const { Router } = require("express");
const { body, param, query } = require("express-validator");
const { v4: uuid } = require("uuid");

const { GameSetSize } = require("../utils/constants");
const {
  generateRandomCardsSet,
  storeGameData,
  getGameData
} = require("../utils/helpers");
const validateRequest = require("../middlewares/validateRequest");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

const router = Router();

router.get("/tester", (req, res) => {
  res.send("Hi");
});

router.get("/game-details", (req, res) => {
  res.send({
    success: true,
    data: GameSetSize
  });
});

router.post(
  "/init",
  [
    body("difficulty", "Please provide valid difficulty level").isIn(
      Object.keys(GameSetSize)
    )
  ],
  validateRequest,
  async (req, res) => {
    const { difficulty } = req.body;

    const cardsSet = generateRandomCardsSet(difficulty);
    const fileId = uuid();
    const game = {
      difficulty,
      cardsSet,
      errorScore: 0,
      cardClicks: 0,
      endedAt: null,
      createdAt: new Date().toISOString()
    };

    await storeGameData(fileId, game);

    // remove color property from cards before sending in response
    const obfuscatedCards = cardsSet.map((c) => ({ ...c, color: undefined }));

    res.status(201).send({
      success: true,
      data: {
        fileId,
        ...game,
        cardsSet: obfuscatedCards
      }
    });
  }
);

router.get(
  "/card/:fileId/:index",
  [
    param("fileId").not().isEmpty().withMessage("File Id is required"),
    param("index").isInt({ min: 0 }).withMessage("Invalid card")
  ],
  validateRequest,
  async (req, res) => {
    const { fileId, index } = req.params;

    const game = await getGameData(fileId);

    if (!game) {
      throw new NotFoundError("Game not found");
    }

    if (game.endedAt) {
      throw new BadRequestError("Game already ended");
    }

    const { difficulty, cardsSet } = game;

    const cardsSetSize = GameSetSize[difficulty] * 2;

    if (index >= cardsSetSize) {
      throw new BadRequestError("Invalid card");
    }

    const card = cardsSet[index];

    if (!card) {
      throw new BadRequestError("Invalid card");
    }

    const cardClicks = game.cardClicks + 1;
    game.cardClicks = cardClicks;

    await storeGameData(fileId, game);

    res.send({
      success: true,
      data: {
        index: +index,
        cardClicks,
        card
      }
    });
  }
);

router.post(
  "/play",
  [
    body("fileId").not().isEmpty({ ignore_whitespace: true }),
    body("cardOneIndex").isInt({ min: 0 }),
    body("cardTwoIndex").isInt({ min: 0 })
  ],
  validateRequest,
  async (req, res) => {
    const { fileId, cardOneIndex, cardTwoIndex } = req.body;

    if (cardOneIndex === cardTwoIndex) {
      throw new BadRequestError("Cards must be different");
    }

    const game = await getGameData(fileId);

    if (!game) {
      throw new NotFoundError("Game not found");
    }

    if (game.endedAt) {
      throw new BadRequestError("Game already ended");
    }

    const cardsSetSize = GameSetSize[game.difficulty] * 2;

    if (cardOneIndex >= cardsSetSize || cardTwoIndex >= cardsSetSize) {
      throw new BadRequestError("Invalid card index");
    }

    const { cardsSet } = game;

    const cardOne = cardsSet[cardOneIndex]; // SET 1
    const cardTwo = cardsSet[cardTwoIndex]; // SET 2

    if (cardOne.discovered && cardTwo.discovered) {
      throw new BadRequestError("Cannot play same cards again!");
    }

    let match = false;

    if (cardOne.color === cardTwo.color) {
      cardOne.discovered = true;
      cardTwo.discovered = true;

      match = true;
    } else {
      game.errorScore++;
    }

    // check and mark game ended if all cards of a set are discovered
    const hasEnded = cardsSet.every((c) => c.discovered);
    if (hasEnded) {
      game.endedAt = new Date().toISOString();
    }

    await storeGameData(fileId, game);

    res.send({
      success: true,
      data: { endedAt: game.endedAt, match, errorScore: game.errorScore }
    });
  }
);

module.exports = router;
