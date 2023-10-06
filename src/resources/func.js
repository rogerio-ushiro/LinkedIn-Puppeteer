import data from '../data.json';
console.log(data);

const sortTimeago = require("./sort-timeago");
import { createPDF } from "./create-pdf";

const write = (items) => {
  createPDF(sortTimeago(items));
};

const getKeywords = (results) => {
  var foundWords = [];
  for (let index = 0; index < data.interests.length; index++) {
    const element = data.interests[index];
    if (results.description.toLowerCase().includes(element.toLowerCase()))
      foundWords.push(element);
  }
  results.keywords = foundWords;
  return results;
};

const getLink = async (page, result) => {
  await page.waitForSelector(".topcard__link");
  const url = await page.$eval(".topcard__link", (a) => a.href);
  result.url = url;
  return result;
};

const getLastBlock = async (page, result) => {
  const options = await page.$$eval(
    ".description__job-criteria-text",
    (options) => {
      return options.map((option) => option.textContent);
    }
  );
  result.level = options[0] ? options[0].trim() : "";
  result.type = options[1] ? options[1].trim() : "";
  return result;
};

const getTitleInfoBlock = async (page, result) => {
  const job = await page.$eval(".top-card-layout__title", (e) => e.textContent);
  const company = await page.$eval(
    ".topcard__org-name-link",
    (e) => e.textContent
  );
  const location = await page.$$eval(".topcard__flavor", (options) => {
    return options.map((option) => option.textContent);
  });
  const timeago = await page.$eval(".posted-time-ago__text", (e) =>
    e.textContent.trim()
  );
  result.job = job;
  result.company = company.trim();
  result.location = location.toString().split("\n")[5].trim();
  result.timeago = timeago
    .replace(" days", "d")
    .replace(" day", "d")
    .replace(" weeks", "w")
    .replace(" week", "w")
    .replace(" hours", "h")
    .replace(" hour", "h");
  return result;
};

const getDescriptionBlock = async (page, result) => {
  await page.waitForSelector(".show-more-less-html__markup");

  const desc = await page.$eval(
    ".show-more-less-html__markup",
    (div) => div.innerText
  );

  result.description = desc;

  result.english =
    result.description.toLowerCase().includes("inglese") ||
    result.description.toLowerCase().includes("english");

  result.remote =
    result.description.toLowerCase().includes("remote") ||
    result.description.toLowerCase().includes("distanza");
  return result;
};

module.exports = {
  write,
  getLink,
  getLastBlock,
  getTitleInfoBlock,
  getDescriptionBlock,
  getKeywords,
};
