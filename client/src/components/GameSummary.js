import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardText,
  Button,
  CardBody,
  Table
} from "reactstrap";
import PropTypes from "prop-types";
import { formatDurationSeconds } from "../utils/helpers";

const GameSummary = (props) => {
  const { details, onStartNewGame, ...rest } = props;

  return (
    <Card className="text-center" {...rest}>
      <CardHeader tag="h3">Game Over</CardHeader>
      <CardBody>
        <CardTitle tag="h5">Game Stats</CardTitle>
        {/* <CardText> */}
        <Table borderless>
          <tbody>
            <tr>
              <th scope="row">Difficulty</th>
              <td className="text-capitalize">{details.difficulty}</td>
            </tr>
            <tr>
              <th scope="row">Time Elapsed</th>
              <td>
                {formatDurationSeconds(details.createdAt, details.endedAt)}
              </td>
            </tr>
            <tr>
              <th scope="row">Error Score</th>
              <td>{details.errorScore}</td>
            </tr>
            <tr>
              <th scope="row">Card Clicks</th>
              <td>{details.cardClicks}</td>
            </tr>
          </tbody>
        </Table>
        {/* </CardText> */}
        <Button color="primary" onClick={onStartNewGame}>
          New Game
        </Button>
      </CardBody>
    </Card>
  );
};

GameSummary.propTypes = {
  details: PropTypes.object.isRequired,
  onNewGame: PropTypes.func
};

export default GameSummary;
