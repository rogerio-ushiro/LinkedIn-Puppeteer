/**
 * @name Amazon search
 *
 * @desc Looks for a "nyan cat pullover" on amazon.com, goes two page two clicks the third one.
 */
const puppeteer = require("puppeteer");
var pdf = require("pdf-creator-node");
var fs = require("fs");

const screenshot = "amazon_nyan_cat_pullover.png";
// var html = fs.readFileSync("template.html", "utf8");

const exec = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "./chrome-win/chrome.exe",
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  // await page.goto("https://www.linkedin.com/jobs/");
  // await page.type("#session_key", "rogerio.ushiro@gmail.com");
  // await page.type("#session_password", "_8DE(yRQs=WCi.C");
  // await page.click('[data-id="sign-in-form__submit-btn"]');

  // await page.waitForSelector("#jobs-search-box-keyword-id-ember23");

  await page.goto(
    // "https://www.linkedin.com/jobs/search/?keywords=Fullstack&location=Italy"
    "https://www.linkedin.com/jobs/search/?keywords=Fullstack&location=Italy&f_TPR=r2592000"
      );

  var items = await getData(page);

  // await page.click(".base-card__full-link")[1];

  // await page.waitForSelector("[data-job-id]");

  // await browser.close();
  // console.log("See screenshot: " + screenshot);

  // console.log("items", items);
};

exec();

const write = (json) => {
  fs.appendFile("vagas.scv", JSON.stringify(json) + "\n", function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
};

const getData = async (page) => {
  const items = [];
  return new Promise(async (resolve, reject) => {
    const divs = await page.$$(".base-card__full-link");

    // for (let index = 0; index < 5; index++) {
    for (let index = 0; index < divs.length; index++) {
      await page.waitForTimeout(index * 1000);

      const div = divs[index];

      const result = async () => {
        await div.click();

        var result = {};

        await page.waitForSelector(".top-card-layout__entity-info");

        result = await getTitleInfoBlock(page, result);
        result = await getLink(page, result);
        result = await getLastBlock(page, result);
        result = await getDescriptionBlock(page, result);
        
        if (result.english) write(result);
        else console.log(index+` - `);
        
        return result;
      };

      items.push(result());

      if (index === divs.length - 1) resolve(items);
    }
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
  result.timeago = timeago;
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
