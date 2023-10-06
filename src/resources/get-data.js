import isValid from "./resources/isValid";
import {
    getDescriptionBlock,
    getLastBlock,
    getLink,
    getTitleInfoBlock,
    getKeywords,
    write,
} from "./resources/func";

export async function getData(page) {
    queue.push(async () => {
        jobList = await page.$$('.jobs-search__results-list > li');
        var result = {};
        await jobList[index].click();
        await page.waitForSelector(".top-card-layout__entity-info");

        result = await getTitleInfoBlock(page, result);
        result = await getLink(page, result);
        result = await getLastBlock(page, result);
        result = await getDescriptionBlock(page, result);
        result = await getKeywords(result);

        if (isValid(result, mustHave, mustNotHave)) {
            matchFound.push(result);
            write(matchFound);
        } else {
            console.log(`${index++} - ${matchFound.length} items`);
        }
    })
}