const mustContains = (text, array) => {
  if (array.length == 0) return true;
  var validWords = 0;
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (text.description.toLowerCase().includes(element.toLowerCase())) validWords++;
  }
  return validWords === array.length;
};

const mustNotContains = (text, array) => {
  if (array.length == 0) return true;
  var result = true;
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (text.description.toLowerCase().includes(element.toLowerCase())) result = false;
  }
  return result;
};

const isValid = (result, data) => {
  const mustHaveEnglish = data.english ? result.english : true;
  const mustBeRemote = data.remote ? result.remote : true;
  return (
    mustHaveEnglish &&
    mustBeRemote &&
    mustContains(result, data.mustHave) &&
    mustNotContains(result, data.mustNotHave)
  );
};

module.exports = isValid;
