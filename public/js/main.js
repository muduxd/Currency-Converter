const baseCurrency = document.querySelector("#base-currency");
const toCurrency = document.querySelector("#to-currency");

const baseInput = document.querySelector("#base-input");
const toInput = document.querySelector("#to-input");

let currencies = [];
let rate = 1;

const fetchCurrencies = async () => {
  try {
    const result = await fetch("/getCurrencies");
    return await result.json();
  } catch (e) {
    return;
  }
};

const changeCurrency = async () => {
  if (baseCurrency.value && toCurrency.value)
    try {
      const result = await fetch(`/getRate?base_currency=${baseCurrency.value}`);
      return await result.json();
    } catch (e) {
      return;
    }
  return;
};

fetchCurrencies().then(({ currencies, symbols }) => {
  currencies.forEach((currency, index) => {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");

    option1.value = currency;
    option2.value = currency;

    option1.textContent = currency;
    option2.textContent = currency;

    if (symbols[index]) {
      option1.textContent += ` - ${symbols[index]}`;
      option2.textContent += ` - ${symbols[index]}`;
    }

    if (currency === "EUR") {
      option1.selected = true;
      option2.selected = true;
    }

    baseCurrency.appendChild(option1);
    toCurrency.appendChild(option2);
  });
});

baseCurrency.addEventListener("change", () =>
  changeCurrency().then((result) => {
    rate = result[toCurrency.value];

    if (baseCurrency.value === "BTC") rate *= 1000;
    if (baseCurrency.value === toCurrency.value) rate = 1;

    toInput.value = baseInput.value * rate;
  })
);

toCurrency.addEventListener("change", () =>
  changeCurrency().then((result) => {
    rate = result[toCurrency.value];

    if (toCurrency.value === "BTC") rate /= 1000;
    if (baseCurrency.value === toCurrency.value) rate = 1;

    baseInput.value = toInput.value / rate;
  })
);

baseInput.addEventListener("keyup", () => (toInput.value = baseInput.value * rate));
toInput.addEventListener("keyup", () => (baseInput.value = toInput.value / rate));
