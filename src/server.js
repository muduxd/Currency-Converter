const getSymbolFromCurrency = require("currency-symbol-map")
const express = require("express")
const axios = require("axios")
const path = require("path")

require("dotenv").config()
const app = express()
const PORT = process.env.PORT || 8080
const BASE_URL = process.env.URL


//!-MIDDLEWARE-

app.set("view engine", "hbs")
app.use(express.json())
app.use(express.static(path.join(__dirname, "../public")))


//!-ROUTES-

app.get("/", (request, response) => response.render("main"))

app.get("/getRate", async (request, response) => {
  const baseCurrency = request.query.base_currency
  const url = `${BASE_URL}&base_currency=${baseCurrency}`

  try {
    const {data} = await axios.get(url)

    return response.status(201).send(data.data)
  }
  catch(e) {
    console.log(e)
    return response.status(500).send({})
  }

})

app.get("/getCurrencies", async (request, response) => {
  try {
    const {data} = await axios.get(BASE_URL)
    const currencyList = Object.keys(data.data)

    currencyList.push("USD")

    return response.status(201).send({
      currencies: currencyList.sort(),
      symbols: currencyList.sort().map((currency) => getSymbolFromCurrency(currency)),
    })
  }
  catch(e) {
    return response.status(500).send({})
  }

})

app.get("*", (request, response) => response.render("404"))


//!-LISTEN-

app.listen(PORT)