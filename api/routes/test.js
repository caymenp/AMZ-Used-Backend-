const axios = require("axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const itemData = {};

let productUsedURL = "";

function checkProduct(productURL) {
  const indexNum = productURL.indexOf("/dp/");
  const productNumber = productURL.slice(indexNum + 4, indexNum + 14);
  productUsedURL = `https://www.amazon.com/dp/${productNumber}/ref=olp-opf-redir?aod=1&ie=UTF8&condition=USED`;
  runChromeEngine(productUsedURL);
}

let body = "";
async function runChromeEngine(usedURL) {
  try {
    const chrome = await puppeteer.launch({
      headless: false,
      args: [
        `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36`,
      ],
    });
    const page = await chrome.newPage();
    await page.goto(usedURL);
    await page.waitForSelector("#aod-price-1", { timeout: 2000 });

    body = await page.evaluate(() => {
      return document.querySelector("body").innerHTML;
    });
    await chrome.close();
    cheerioProd(body);
  } catch (error) {
    console.log(error);
  }
}

function cheerioProd(HTMLbody) {
  // parsing the HTML source of the target web page with Cheerio

  const $ = cheerio.load(HTMLbody);

  //Getting Product Title
  const productTitle = $("#productTitle").text().trim();

  //ProductURL
  const prodURL = $('link[rel="canonical"]').attr("href");

  //Getting New Price String
  const newPriceString = $("#twister-plus-price-data-price").attr("value");
  //Finding $ sign index for splitting
  const splitAt = newPriceString.indexOf("$");
  //Splitting at the $, resulting in just the $ amount, and transversing it into a number with '+'
  const newPrice = +newPriceString.slice(splitAt + 1);
  //Getting Lowest Price String
  const usedPriceString = $("#aod-price-1 .a-price .a-offscreen").text().trim();
  //Finding $ sign index for splitting
  const splitIndex = usedPriceString.indexOf("$");
  //Splitting at the $, resulting in just the $ amount, and transversing it into a number with '+'
  const lowestPrice = +usedPriceString.slice(splitIndex + 1);

  //Getting Used Link
  const usedLink = $("a .a-touch-link").attr("href");
  const fullUsedLink = `amazon.com${usedLink}`;

  //Link Object
  itemData.productURL = prodURL;
  itemData.productName = productTitle;
  itemData.productPriceNew = newPrice;
  itemData.productPriceUsed = [{ usedPrice: lowestPrice }];
}

checkProduct(
  "https://www.amazon.com/dp/B09SBT74HX/ref=olp-opf-redir?aod=1&ie=UTF8&condition=USED"
);
