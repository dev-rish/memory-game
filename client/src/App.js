import { Container, Row, Col } from "reactstrap";
import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import useRequest from "./hooks/useRequest";
import useInterval from "./hooks/useInterval";
import DifficultyCard from "./components/DifficultyCard";
import PlayingCard from "./components/PlayingCard";
import GameSummary from "./components/GameSummary";
import GameStats from "./components/GameStats";

function App() {
  const [gameDetails, setGameDetails] = useState({});
  const [gameProgress, setGameProgress] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
  const [hasStarted, setHasStarted] = useState(false);
  const [cardOneInfo, setCardOneInfo] = useState({});
  const [cardTwoInfo, setCardTwoInfo] = useState({});
  const [cardsSet, setCardsSet] = useState([]);

  const [getGameDetails] = useRequest({
    method: "GET",
    url: "/game-details",
    onComplete(response) {
      setGameDetails(response.data);
    }
  });

  const [initGame] = useRequest({
    method: "POST",
    url: "/init",
    onComplete(response) {
      const { cardsSet, ...rest } = response.data;
      setCardsSet(cardsSet);

      setGameProgress(rest);

      setHasStarted(true);
    }
  });

  const [getCardDetails, { loading: cardDetailsLoading }] = useRequest({
    method: "GET",

    onComplete(response) {
      const { index, cardClicks, card } = response.data;

      // update card color
      const cardsSetCopy = cardsSet.slice();
      cardsSetCopy[index] = card;
      setCardsSet(cardsSetCopy);

      // track revealed card
      const info = { index, timeLeft: 3 };

      if (isEmpty(cardOneInfo)) {
        setCardOneInfo(info);
      } else if (isEmpty(cardTwoInfo)) {
        setCardTwoInfo(info);
      }

      // update player's card clicks
      setGameProgress({ ...gameProgress, cardClicks });
    }
  });

  const [playChance, { loading: playChanceLoading }] = useRequest({
    method: "POST",
    url: "/play",
    onComplete(response) {
      const { match, ...rest } = response.data;

      // update card status after creating a delay of 1s before closing cards for better experience
      setTimeout(() => {
        setGameProgress((prev) => ({ ...prev, ...rest }));
        const cardsSetCopy = cardsSet.slice();
        cardsSetCopy[cardOneInfo.index].discovered = match;
        cardsSetCopy[cardTwoInfo.index].discovered = match;

        setCardsSet(cardsSetCopy);

        setCardOneInfo({});
        setCardTwoInfo({});
      }, 1000);
    }
  });

  useEffect(() => {
    getGameDetails();
  }, []);

  // Timer for Card One
  useInterval(
    () => {
      const timeLeft = cardOneInfo.timeLeft - 1;
      if (timeLeft > 0) {
        setCardOneInfo({ ...cardOneInfo, timeLeft });
      } else {
        setCardOneInfo({});
      }
    },
    cardOneInfo.timeLeft > 0 ? 1000 : null
  );

  // Timer for Card Two
  useInterval(
    () => {
      const timeLeft = cardTwoInfo.timeLeft - 1;
      if (timeLeft > 0) {
        setCardTwoInfo({ ...cardTwoInfo, timeLeft });
      } else {
        setCardTwoInfo({});
      }
    },
    cardTwoInfo.timeLeft > 0 ? 1000 : null
  );

  useInterval(
    () => {
      setTimeElapsed(timeElapsed + 1);
    },
    hasStarted && !gameProgress.endedAt ? 1000 : null
  );

  useEffect(() => {
    if (!isEmpty(cardOneInfo) && !isEmpty(cardTwoInfo)) {
      playChance({
        data: {
          fileId: gameProgress.fileId,
          cardOneIndex: cardOneInfo.index,
          cardTwoIndex: cardTwoInfo.index
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardOneInfo.index, cardTwoInfo.index]);

  const handleStartGame = async (difficulty) => {
    await initGame({ data: { difficulty } });
  };

  const handleCardClick = (index) => {
    if (cardDetailsLoading || playChanceLoading) return;
    if (!isEmpty(cardOneInfo) && !isEmpty(cardTwoInfo)) return;
    if (cardOneInfo.index === index || cardTwoInfo.index === index) return;

    getCardDetails({
      url: `/card/${gameProgress.fileId}/${index}`
    });
  };

  const handleStartNewGame = () => {
    setGameProgress({});
    setTimeElapsed(0);
    setHasStarted(false);
    setCardOneInfo({});
    setCardTwoInfo({});
    setCardsSet([]);
  };

  const renderCards = () => {
    return (
      <Container>
        <Row>
          {cardsSet.map((card, i) => (
            <Col className="text-center" key={i}>
              <PlayingCard
                key={i}
                cardDetails={card}
                isOpen={cardOneInfo.index === i || cardTwoInfo.index === i}
                onClick={() => handleCardClick(i)}
              />
            </Col>
          ))}
        </Row>
      </Container>
    );
  };

  return (
    <Container fluid className="mt-5">
      {!hasStarted &&
        Object.keys(gameDetails).map((value) => (
          <Row key={value}>
            <Col>
              <DifficultyCard
                className="w-50 mx-auto mb-3"
                title={value}
                onStartGame={() => handleStartGame(value)}
              />
            </Col>
          </Row>
        ))}
      {hasStarted && !gameProgress.endedAt && (
        <Row>
          <Col>{renderCards()}</Col>
          <Col>
            <GameStats
              stats={gameProgress}
              timeElapsed={timeElapsed}
              onStartNewGame={handleStartNewGame}
            />
          </Col>
        </Row>
      )}
      {hasStarted && gameProgress.endedAt && (
        <GameSummary
          className="w-75 mx-auto text-center"
          details={gameProgress}
          onStartNewGame={handleStartNewGame}
        />
      )}
    </Container>
  );
}

export default App;
