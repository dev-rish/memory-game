import { Card, CardBody, CardTitle, Button } from "reactstrap";
import PropTypes from "prop-types";

const DifficultyCard = ({ title, onStartGame, ...rest }) => {
  const getColor = () => {
    if (title === "easy") return "info";
    if (title === "medium") return "success";
    if (title === "hard") return "danger";
    return "secondary";
  };

  return (
    <Card {...rest}>
      <CardBody className="text-center">
        <CardTitle tag="h5" className="text-capitalize">
          {title}
        </CardTitle>

        <Button color={getColor()} onClick={onStartGame}>
          Start Game
        </Button>
      </CardBody>
    </Card>
  );
};

DifficultyCard.propTypes = {
  title: PropTypes.string.isRequired,
  onStartGame: PropTypes.func.isRequired
};

export default DifficultyCard;
