const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

let body = "";
let userEmail = "";
let productURL = "";
let productUsedURL = "";

router.post("/getItemData", async (req, res) => {
  userEmail = req.body.userEmail;
  productURL = req.body.productURL;
  //Scraping Data
  const indexNum = productURL.indexOf("/dp/");
  const productNumber = productURL.slice(indexNum + 4, indexNum + 14);
  productUsedURL = `https://www.amazon.com/dp/${productNumber}/ref=olp-opf-redir?aod=1&ie=UTF8&tag=pricecut20-20&condition=USED`;

  try {
    await runChromeEngine(productUsedURL).then((response) => {
      console.log("Response: ", response);
      return res.status(200).json(response);
    });
  } catch (error) {
    console.log("Error from /getItemData: ", error);
    return res.status(400).json({ message: error.message });
  }
});

async function runChromeEngine(usedURL) {
  try {
    const chrome = await puppeteer.launch({
      headless: true,
      args: [
        `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36`,
      ],
    });
    const page = await chrome.newPage();
    console.log("Chrome is open");
    await page.goto(usedURL, { waitUntil: "networkidle2" });

    body = await page.evaluate(() => {
      return document.querySelector("body").innerHTML;
    });
    await chrome.close();
  } catch (error) {
    console.log(error);
  }

  const item = cheerioProd(body);
  return item;
}

function cheerioProd(HTMLbody) {
  const itemData = {};
  console.log("made it to cheerio");
  // parsing the HTML source of the target web page with Cheerio

  const $ = cheerio.load(HTMLbody);

  //Getting Product Title
  const productTitle = $("#aod-asin-title-text").text().trim();

  //ProductURL
  const prodURL = $('link[rel="canonical"]').attr("href");

  //Getting New Price String
  let newPriceString = $("#twister-plus-price-data-price")
    .attr("value")
    .replace("$", "")
    .replace(",", "");

  //Splitting at the $, resulting in just the $ amount, and transversing it into a number with '+'
  const newPrice = Number(newPriceString);
  //Getting Lowest Price String
  let allPricesArray = [];
  const allPrices = $("#aod-offer #aod-offer-price .a-price .a-offscreen").map(
    function (i, element) {
      allPricesArray.push(
        Number($(element).text().trim().replace("$", "").replace(",", ""))
      );
    }
  );

  let lowestPrice;

  if (allPricesArray.length === 0) {
    lowestPrice = 0;
  } else {
    allPricesArray.sort((a, b) => {
      return a - b;
    });

    lowestPrice = allPricesArray[0];
  }

  //Product Image
  const prodImg = $("#aod-asin-image-id").attr("src");

  //Getting Used Link
  const usedLink = $("a .a-touch-link").attr("href");
  const fullUsedLink = `amazon.com${usedLink}`;
  //Link Object
  itemData.userEmail = userEmail;
  itemData.productURL = productUsedURL;
  itemData.prodImg = prodImg;
  itemData.productName = productTitle;
  itemData.fullPrice = newPrice;
  itemData.productPriceUsed = [{ usedPrice: lowestPrice }];

  console.log("returning to getItemData Main");
  return itemData;
}

module.exports = router;
