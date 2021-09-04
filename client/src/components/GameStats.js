import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import PropTpyes from "prop-types";
import { formatSeconds } from "../utils/helpers";

const GameStats = ({ stats, onStartNewGame, timeElapsed }) => {
  const [toggle, setToggle] = useState(false);

  // create blinking effect
  useEffect(() => {
    setToggle(!toggle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeElapsed]);

  return (
    <Container>
      <Row>
        <Col>
          <div
            className={`p-2 m-2 border border-3 border-${
              toggle ? "secondary" : "light"
            } rounded text-capitalize text-center`}
          >
            <h5>Time Elapsed</h5>
            <h6 className="text-secondary  fw-bold">
              {formatSeconds(timeElapsed)}
            </h6>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="p-2 m-2 border border-3 border-primary rounded text-capitalize text-center">
            <h5>Difficulty</h5>
            <h6 className="text-secondary  fw-bold">{stats.difficulty}</h6>
          </div>
        </Col>
        <Col>
          <div className="p-2 m-2 border border-3 border-danger rounded text-capitalize text-center">
            <h5>Error Score</h5>
            <h6 className="text-secondary  fw-bold">{stats.errorScore}</h6>
          </div>
        </Col>
        <Col>
          <div className="p-2 m-2 border border-3 border-warning rounded text-capitalize text-center">
            <h5>Card Clicks</h5>
            <h6 className="text-secondary fw-bold">{stats.cardClicks}</h6>
          </div>
        </Col>
      </Row>
      <Row></Row>
      <Row></Row>
      <Row>
        <Col>
          <Button
            color="primary"
            className="d-block mx-auto mt-3"
            onClick={onStartNewGame}
          >
            New Game
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

GameStats.propTypes = {
  stats: PropTpyes.object.isRequired,
  onStartNewGame: PropTpyes.func.isRequired,
  timeElapsed: PropTpyes.number.isRequired
};

export default GameStats;
