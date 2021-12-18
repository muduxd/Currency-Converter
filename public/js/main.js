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

fetchCurrencies().then((result) => {
  currencies = result;

  currencies.forEach((currency) => {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");

    option1.value = currency;
    option2.value = currency;

    option1.textContent = currency;
    option2.textContent = currency;

    baseCurrency.appendChild(option1);
    toCurrency.appendChild(option2);
  });
});

baseCurrency.addEventListener("change", () =>
  changeCurrency().then((result) => {
    rate = result[toCurrency.value];
    toInput.value = (baseInput.value * rate).toFixed(2);
  })
);

toCurrency.addEventListener("change", () =>
  changeCurrency().then((result) => {
    rate = result[toCurrency.value];
    baseInput.value = (toInput.value / rate).toFixed(2);
  })
);

baseInput.addEventListener("keyup", () => (toInput.value = (baseInput.value * rate).toFixed(2)));
toInput.addEventListener("keyup", () => (baseInput.value = (toInput.value / rate).toFixed(2)));
