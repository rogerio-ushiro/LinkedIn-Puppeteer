const puppeteer = require("puppeteer");
// const {
//   write,
//   getLink,
//   getLastBlock,
//   getTitleInfoBlock,
//   getDescriptionBlock,
// } = require("./resouces");
var pdf = require("pdf-creator-node");
var fs = require("fs");
const isValid = require("./resources/isValid");
const sortTimeago = require("./sort-timeago");

const mustHave = [];
const mustNotHave = [];

const items = [];
const queue = [];
var index = 0;
const timer = setInterval(() => {
  try {
    queue[index++]();
  } catch (e) {
    clearInterval(timer);
  }
}, 3000);

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "./chrome-win/chrome.exe",
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto(
    "https://www.linkedin.com/jobs/search/?keywords=Fullstack&location=Italy&f_TPR=r2592000"
  );

  for (let index = 0; index < 1000; index++) {
    queue.push(async () => {
      const divs = await page.$$(".base-card__full-link");

      const div = divs[index];

      await div.click();

      var result = {};

      await page.waitForSelector(".top-card-layout__entity-info");

      result = await getTitleInfoBlock(page, result);
      result = await getLink(page, result);
      result = await getLastBlock(page, result);
      result = await getDescriptionBlock(page, result);
      if (isValid(result, mustHave, mustNotHave)) {
        items.push(result);
        write(items);
      } else {
        console.log(`${index} - ${items.length} items`);
      }
    });
  }
})();

const write = (items) => {
  fs.writeFile("vagas.json", JSON.stringify(sortTimeago(items)), (err) => {
    if (err) throw err;
    console.log("Saved!");
  });
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
