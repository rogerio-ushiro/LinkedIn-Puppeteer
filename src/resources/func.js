const keywords = [
  "node",
  "java",
  "Ruby on Rails",
  "J2EE",
  "EJB",
  "JPA",
  "servlet",
  "spring",
  "maven",
  "junit",
  "es6",
  "typescript",
  "javaScript",
  "amazon",
  "PHP",
  "Laravel",
  "Drupal",
  "Symfony",
  "Cloud",
  "AWS",
  "Heroku",
  "azure",
  "gcp",
  "tdd",
  "unit testing",
  "Cypress",
  "redux",
  "react",
  "angular",
  "vue.js",
  "struts",
  "kotlin",
  "database",
  "mongodb",
  "sql",
  "mysql",
  "nosql",
  "postgresql",
  "jquery",
  "HTML",
  "CSS",
  "SASS",
  "cd/ci",
  "ci/cd",
  "cicd",
  "DevOps",
  "terraform",
  "ElasticSearch",
  "jest",
  "jasmine",
  "solid",
  "Clean code",
  "scrum",
  "agile",
  "bootstrap",
  "git",
  "webpack",
  "SSG",
  "babel",
  "grunt",
  "npm",
  "google",
  "firebase",
  "rest",
  "soap",
  "c#",
  "python",
  "C++",
  "mobile",
  "android",
  "ios",
  ".net",
  "dotnet",
  "MariaDB",
  "dynamodb",
  "Graphql",
  "redis",
  "Microservice",
  "nest",
  "docker",
  "kubernetes",
  "OOP",
  "linux",
];

const sortTimeago = require("./sort-timeago");
import fs from "fs";
import { createPDF } from "./create-pdf";

const write = (items) => {
  createPDF(sortTimeago(items));
  // fs.writeFile(
  //   "./repository/vagas.json",
  //   JSON.stringify(sortTimeago(items)),
  //   (err) => {
  //     if (err) throw err;
  //     console.log("Saved!");
  //   }
  // );
};

const getKeywords = (results) => {
  var foundWords = [];
  for (let index = 0; index < keywords.length; index++) {
    const element = keywords[index];
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
