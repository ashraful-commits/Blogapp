import moment from "moment";

export const createAtFormat = (createdAt : number) => {

  // Ensure the timestamp is in the correct format
  const fixedTimestamp = Math.floor(createdAt / 1000);

  // Format the readable date
  const readableDate = moment(fixedTimestamp * 1000).format(
    "MMMM DD, YYYY, h:mm A"
  );

  return readableDate;
};

export const createdAtByUseer = (createdAt : number) => {

  // Ensure the timestamp is in the correct format
  const fixedTimestamp = Math.floor(createdAt / 1000);

  // Format the readable date
  const readableDate = moment(fixedTimestamp * 1000).format(
    "MMM DD, YYYY"
  );

  return readableDate;
};
