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
  getData(index, page);

  setInterval(async () => {
    jobVacancyList = await page.$$('.jobs-search__results-list > li');
  }, 10 * 1000);

  setInterval(() => {
    if (typeof queue[index]() === 'function')
      queue[index]()
  }, 3 * 1000);
}

const getData = async (i, page) => {
  queue.push(async () => {
    var jobVacancy = {};
    await jobVacancyList[i].click();
    await page.waitForSelector(".top-card-layout__entity-info");

    jobVacancy = await getTitleInfoBlock(page, jobVacancy);
    jobVacancy = await getLink(page, jobVacancy);
    jobVacancy = await getLastBlock(page, jobVacancy);
    jobVacancy = await getDescriptionBlock(page, jobVacancy);
    jobVacancy = await getKeywords(jobVacancy);

    if (isValid(jobVacancy, data)) {
      matchFound.push(jobVacancy);
      write(matchFound);
    }

    console.log(`${i++} - ${matchFound.length} jobs saved`);

  })
}

run();
