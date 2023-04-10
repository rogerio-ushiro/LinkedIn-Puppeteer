const sortTimeago = (array) => {
  let hour = [];
  let day = [];
  let week = [];
  let month = [];

  array.forEach((item) => {
    switch (true) {
      case item.timeago.includes("h"):
        hour.push(item);
        break;
      case item.timeago.includes("d"):
        day.push(item);
        break;
      case item.timeago.includes("w"):
        week.push(item);
        break;
      case item.timeago.includes("m"):
        month.push(item);
        break;
      default:
        break;
    }
  });

  hour = hour.sort((a, b) => (a.timeago > b.timeago ? 1 : -1));
  day = day.sort((a, b) => (a.timeago > b.timeago ? 1 : -1));
  week = week.sort((a, b) => (a.timeago > b.timeago ? 1 : -1));
  month = month.sort((a, b) => (a.timeago > b.timeago ? 1 : -1));

  return [].concat(hour).concat(day).concat(week).concat(month);
};

module.exports = sortTimeago;
