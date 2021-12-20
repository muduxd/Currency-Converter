const getSymbolFromCurrency = require("currency-symbol-map");
const express = require("express");
const req = require("request");
const path = require("path");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8080;
const BASE_URL = process.env.URL;

//!-MIDDLEWARE-

app.set("view engine", "hbs");
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

//!-ROUTES-

app.get("/", (request, response) => response.render("main"));

app.get("/getRate", (request, response) => {
  const baseCurrency = request.query.base_currency;
  const url = `${BASE_URL}&base_currency=${baseCurrency}`;

  req({ url, json: true }, (error, { body }) => {
    if (error) response.status(500).send({});
    else response.status(201).send(body.data);
  });
});

app.get("/getCurrencies", (request, response) => {
  req({ url: BASE_URL, json: true }, (error, { body }) => {
    if (error) response.status(500).send({});
    else {
      const currencyList = Object.keys(body.data);
      currencyList.push("USD");

      response.status(201).send({
        currencies: currencyList.sort(),
        symbols: currencyList.sort().map((currency) => getSymbolFromCurrency(currency)),
      });
    }
  });
});

app.listen(PORT);
