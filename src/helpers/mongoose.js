import moment from "moment";

export const handleValidatorErrors = errors => {

  const errorsToReturn = [];

  if (errors.length) {

    errors.forEach(error => {

      Object.keys(error).forEach(field => errorsToReturn.push(error[field].message));

    });

  } else {

    Object.keys(errors).forEach(field => errorsToReturn.push(errors[field].message));

  }

  return errorsToReturn;

};

export const validObjectId = id => {

  const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
  return checkForHexRegExp.test(id);

};

export const getDate = function (datetime) {

  return moment(datetime).utc().format("YYYY-MM-DD");

};

export const setDate = function (date) {

  return moment(date).toDate();

};

export const getTime = function (datetime) {

  return moment(datetime).format("HH:mm");

};

export const setTime = function (time) {

  const today = moment().format("YYYY-MM-DD");
  const datetime = moment(`${today} ${time}`, "YYYY-MM-DD HH:mm").toDate();
  return datetime;

};
