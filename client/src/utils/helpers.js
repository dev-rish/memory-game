import moment from "moment";

export const formatSeconds = (value) => {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  let str = "";
  if (minutes > 0) {
    str += minutes + " minutes ";
  }

  str += seconds + " seconds";
  return str;
};

export const formatDurationSeconds = (startTime, endTime) => {
  const timeTaken = moment(endTime).diff(moment(startTime), "seconds");

  return formatSeconds(timeTaken);
};
