import React from "react";
import classes from "./styles.module.css";

const PlayingCard = ({ cardDetails, isOpen, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        m-1 rounded border border-1
        border-secondary shadow
        position-relative d-inline-block
        ${cardDetails.discovered ? "invisible" : ""}`}
      style={{
        width: "50px",
        height: "45px",
        backgroundColor: isOpen ? cardDetails.color : "#fff"
      }}
    >
      {!isOpen && <img className={classes.icon} alt="" src="/rotate.svg" />}
    </div>
  );
};

export default PlayingCard;
