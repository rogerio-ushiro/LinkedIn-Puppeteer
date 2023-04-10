const contains = (text, array) => {
  var validWords = 0;
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (text.toLowerCase().includes(element.toLowerCase())) validWords++;
  }
  return validWords === array.length;
};

const notContains = (text, array) => {
  var result = true;
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (text.toLowerCase().includes(element.toLowerCase())) result = false;
  }
  return result;
};
const isValid = (result, mustHave, mustNotHave) => {
  return (
    result.english &&
    result.remote &&
    contains(result, mustHave) &&
    notContains(result, mustNotHave)
  );
};
module.exports = isValid;
