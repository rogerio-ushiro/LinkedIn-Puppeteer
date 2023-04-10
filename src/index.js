import puppeteer from "puppeteer";
import isValid from "./resources/isValid";
import {
  getDescriptionBlock,
  getLastBlock,
  getLink,
  getTitleInfoBlock,
  getKeywords,
  write,
} from "./resources/func";

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
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto(
    "https://www.linkedin.com/jobs/search/?keywords=Fullstack&location=germany&refresh=true"
  );

  for (let index = 0; index < 200; index++) {
    queue.push(async () => {
      var result = {};
      const divs = await page.$$(".base-card__full-link");
      const div = divs[index];

      await div.click();

      await page.waitForSelector(".top-card-layout__entity-info");

      result = await getTitleInfoBlock(page, result);
      result = await getLink(page, result);
      result = await getLastBlock(page, result);
      result = await getDescriptionBlock(page, result);
      result = await getKeywords(result);

      if (isValid(result, mustHave, mustNotHave)) {
        items.push(result);
        write(items);
      } else {
        console.log(`${index} - ${items.length} items`);
      }
    });
  }
})();
