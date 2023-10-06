import puppeteer from "puppeteer";
import isValid from "./resources/isValid";
import data from './data.json';
import {
  getDescriptionBlock,
  getLastBlock,
  getLink,
  getTitleInfoBlock,
  getKeywords,
  write,
} from "./resources/func";

let jobVacancyList = [];
const matchFound = [];
const queue = [];
var index = 0;

const run = async () => {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${data.url}?keywords=${data.keywords}&location=${data.location}&refresh=true`);
  await page.waitForSelector('.jobs-search__results-list');

  jobVacancyList = await page.$$('.jobs-search__results-list > li');
  console.log(jobVacancyList.length);

  setInterval(() => {
    getData(index, page);
    if (typeof queue[index]() === 'function')
      queue[index]()
  }, 3000);
}

const getData = async (i, page) => {
  queue.push(async () => {
    jobVacancyList = await page.$$('.jobs-search__results-list > li');
    var result = {};
    await jobVacancyList[i].click();
    await page.waitForSelector(".top-card-layout__entity-info");

    result = await getTitleInfoBlock(page, result);
    result = await getLink(page, result);
    result = await getLastBlock(page, result);
    result = await getDescriptionBlock(page, result);
    result = await getKeywords(result);

    if (isValid(result, data.mustHave, data.mustNotHave)) {
      matchFound.push(result);
      write(matchFound);
    } else {
      console.log(`${i++} - ${matchFound.length} items`);
    }

  })
}

run();
