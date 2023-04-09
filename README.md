# AMZ-USED (Backend)

Backend server built with Node.js with Express. Custom API endpoints utilizing AXIOS library for parsing. Connection with MongoDB hosted in MongoCompass.

Web Scraping for product pricing is done by utilizing Puppeteer library to launch a headless Chromium browser. When the original product URL is entered, it is cut and parsed into a custom Amazon URL that expands the Amazon "other sellers" drawer. Puppeteer wait until this drawer is loaded before capturing the HTML, since Amazon uses javascript to dynamically load their product data.

Once the HTML is captured, it is passed to a function that uses the Cheerio library. This function finds the correct data by searching for certain HTML element class and/or ID tags. Once all the information is collected, it gathers ALL of the 'used' listing prices and determines the lowest price by sorting them within an array data structure.

All of this product data is them used to form a tempory product object that is then passed back to the internal calling API. This function takes the temp object, destructures it and logs the new data to the Mongo Document.

If the item is a new product being added, the relevant information is passed and added as a new document. If the item is an existing item (price refresh to check if item is now lower), it logs the current price and timestamp in a price array within the products document. The function then checks the most recent reported price, to the new price that has just been collected. If lower, an email is triggered to the user.

## Features

- MongoDB
- Web Scraping with Puppeteer & Cheerio
- Auto Triggered Emails When Price Is Lower Than Previously Reported Pricing

## API Reference

#### Get All User Items

```http
  GET /api/userItems
```

| Parameter   | Type     | Description                         |
| :---------- | :------- | :---------------------------------- |
| `userEmail` | `string` | **Required**. Email of user account |

#### Get Item Details

```http
  GET /api/itemDetail
```

| Parameter   | Type     | Description                 |
| :---------- | :------- | :-------------------------- |
| `productID` | `string` | **Required**. ID of Product |

#### Add Item

```http
  POST /api/addItem
```

| Parameter    | Type     | Description                         |
| :----------- | :------- | :---------------------------------- |
| `productURL` | `string` | **Required**. Amazon URL of Product |
| `userEmail`  | `string` | **Required**. Email of user account |

#### Refresh Item

```http
  GET /api/refreshItem
```

| Parameter     | Type     | Description                         |
| :------------ | :------- | :---------------------------------- |
| `productURL`  | `string` | **Required**. Amazon URL of Product |
| `userEmail`   | `string` | **Required**. Email of user account |
| `productID`   | `string` | **Required**.                       |
| `recentPrice` | `string` | Most recent price recorded.         |

#### Delete Item

```http
  POST /api/deleteItem
```

| Parameter   | Type     | Description                        |
| :---------- | :------- | :--------------------------------- |
| `productID` | `string` | **Required**. Id of item to delete |

#### Get Item Data (Not Called Directly)

This endpoint is not to be called directly. This is called when product refresh or add item endpoints are called.

```http
  GET /api/getItemData
```
