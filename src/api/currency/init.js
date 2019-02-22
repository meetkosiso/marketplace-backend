import { success, fail } from "./../../services/response/";
import Currency from "./model";
import { getAnyAdmin } from "../admin/init";

export async function initCurrency(req, res) {

  let admin;
  try {
    admin = await getAnyAdmin();
  } catch (err) {
    console.log(err);
  }

  if (!(admin)) admin = { _id: "5b83c483f85b7a561ce95107" };

  let currency = new Currency({
    _id: "5b559970dc79a83543dddb60",
    name: "U.S Dollar",
    code: "USD",
    description: "Currency of the United States of America",
    kind: "fiat",
    symbol: "$",
    exchange: 1.00,
    standing: "active",
    admin: admin._id,
  });
  currency.save()
    .then((currencyResult) => { currency = Object.assign({}, currencyResult); })
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));

  const currency1 = new Currency({
    name: "U.S Dollar",
    code: "USD",
    description: "Currency of the United States of America",
    kind: "fiat",
    symbol: "$",
    exchange: 1.00,
    standing: "active",
    admin: admin._id,
  });
  
  currency1.save()
    .then((currencyResult) => { currency = Object.assign({}, currencyResult); })
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  const currencyD1 = new Currency({
    name: "Bitcoin",
    code: "BTC",
    description: "Bitcoin Cryptocurrency",
    kind: "digital",
    symbol: "B",
    exchange: 0.00016,
    standing: "active",
    admin: admin._id,
  });
  
  currencyD1.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  const currencyD2 = new Currency({
    name: "Ether",
    code: "ETH",
    description: "Ethereum Cryptocurrency",
    kind: "digital",
    symbol: "E",
    currencyAddress: "0x0000000000000000000000000000000000000000",
    exchange: 0.0035,
    standing: "active",
    admin: admin._id,
  });
  
  currencyD2.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  const currencyD3 = new Currency({
    name: "Bezop",
    code: "BEZ",
    description: "Bezop Cryptocurrency",
    kind: "digital",
    symbol: "BEZ",
    currencyAddress: "0x3839d8ba312751aa0248fed6a8bacb84308e20ed",
    exchange: 0.073479,
    standing: "active",
    admin: admin._id,
  });
  
  currencyD3.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  const currency2 = new Currency({
    name: "Austrian Dollar",
    code: "AUD",
    description: "Currency of Australia",
    kind: "fiat",
    symbol: "$",
    exchange: 1.3163,
    admin: admin._id,
  });
  
  currency2.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  
  const currency3 = new Currency({
    name: "Brazilian Real",
    code: "BRL",
    description: "Currency of Brazil",
    kind: "fiat",
    symbol: "R$",
    exchange: 3.2953,
    admin: admin._id,
  });
  
  currency3.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  
  const currency4 = new Currency({
    name: "Canadian Dollar",
    code: "CAD",
    description: "Currency of Canada",
    kind: "fiat",
    symbol: "$",
    exchange: 1.3199,
    admin: admin._id,
  });
  
  currency4.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  
  const currency5 = new Currency({
    name: "Czech Koruna",
    code: "CZK",
    description: "Currency of Czech Republic",
    kind: "fiat",
    symbol: "Kč",
    exchange: 24.212,
    admin: admin._id,
  });
  
  currency5.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  
  const currency6 = new Currency({
    name: "Danish Krone",
    code: "DKK",
    description: "Currency of Denmark",
    kind: "fiat",
    symbol: "Kr",
    exchange: 6.6675,
    admin: admin._id,
  });
  
  currency6.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  
  const currency7 = new Currency({
    name: "Euro",
    code: "EUR",
    description: "Currency of United Kingdom",
    kind: "fiat",
    symbol: "€",
    exchange: 0.89079,
    admin: admin._id,
  });
  
  currency7.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  
  const currency8 = new Currency({
    name: "Hong Kong Dollar",
    code: "HKD",
    description: "Currency of China",
    kind: "fiat",
    symbol: "$",
    exchange: 7.7587,
    admin: admin._id,
  });
  
  currency8.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  
  const currency9 = new Currency({
    name: "Hungarian Forint",
    code: "HUF",
    description: "Currency of Hungaria",
    kind: "fiat",
    symbol: "Ft",
    exchange: 275.38,
    admin: admin._id,
  });
  
  currency9.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  
  const currency10 = new Currency({
    name: "Israeli New Sheqel",
    code: "ILS",
    description: "Currency of Israel",
    kind: "fiat",
    symbol: "₪",
    exchange: 3.7896,
    admin: admin._id,
  });
  
  currency10.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  
  const currency11 = new Currency({
    name: "Japanese Yen",
    code: " JPY",
    description: "Currency of Japan",
    kind: "fiat",
    symbol: "¥",
    exchange: 101.86,
    admin: admin._id,
  });
  
  currency11.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  
  const currency12 = new Currency({
    name: "Malaysian Ringgit",
    code: " MYR",
    description: "Currency of Malaysia",
    kind: "fiat",
    symbol: "RM",
    exchange: 4.1369,
    admin: admin._id,
  });
  
  currency12.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  
  const currency13 = new Currency({
    name: "Mexico Peso",
    code: " MXN",
    description: "Currency of Mexico",
    kind: "fiat",
    symbol: "$",
    exchange: 19.389,
    admin: admin._id,
  });
  
  currency13.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  const currency14 = new Currency({
    name: "Norwegian Krone",
    code: " NOK",
    description: "Currency of Norway",
    kind: "fiat",
    symbol: "kr",
    exchange: 8.2509,
    admin: admin._id,
  });
  
  currency14.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  const currency15 = new Currency({
    name: "New Zealand Dollar",
    code: " NZD",
    description: "Currency of New Zealand",
    kind: "fiat",
    symbol: "$",
    exchange: 1.3689,
    admin: admin._id,
  });
  
  currency15.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  const currency16 = new Currency({
    name: "Philippine Peso",
    code: "PHP",
    description: "Currency of Philipine",
    kind: "fiat",
    symbol: "₱",
    exchange: 47.872,
    admin: admin._id,
  });
  
  currency16.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  const currency17 = new Currency({
    name: "Polish Zloty",
    code: "PLN",
    description: "Currency of Poland",
    kind: "fiat",
    symbol: "zł",
    exchange: 3.8453,
    admin: admin._id,
  });
  
  currency17.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  const currency18 = new Currency({
    name: "Pound Sterling",
    code: "GBP",
    description: "Currency of United Kingdom",
    kind: "fiat",
    symbol: "£",
    exchange: 0.75898,
    admin: admin._id,
  });
  
  currency18.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  const currency19 = new Currency({
    name: "Russia Ruble",
    code: "RUB",
    description: "Currency of Russia",
    kind: "fiat",
    symbol: "py6",
    exchange: 64.936,
    admin: admin._id,
  });
  
  currency19.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  
  const currency20 = new Currency({
    name: "Singapore Dollar",
    code: "SGD",
    description: "Currency of Singapore",
    kind: "fiat",
    symbol: "$",
    exchange: 1.3645,
    admin: admin._id,
  });
  
  currency20.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  
  const currency21 = new Currency({
    name: "Swedish Krone",
    code: "SEK",
    description: "Currency of Sweden",
    kind: "fiat",
    symbol: "kr",
    exchange: 0.75898,
    admin: admin._id,
  });
  
  currency21.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  const currency22 = new Currency({
    name: "Swiss Franc",
    code: "CHF",
    description: "Currency of Sweden",
    kind: "fiat",
    symbol: "CHF",
    exchange: 0.97461,
    admin: admin._id,
  });
  
  currency22.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  const currency23 = new Currency({
    name: "Thai Baht",
    code: "THB",
    description: "Currency of Thailand",
    kind: "fiat",
    symbol: "฿",
    exchange: 34.91,
    admin: admin._id,
  });
  
  currency23.save()
    .then(currencyResult => console.log(`Currency is added ${currencyResult.code}`))
    .catch(err => fail(res, 500, `Error adding currency ${err.message}`));
  
  return success(res, 200, "added currency");
}

export function getAnyCurrency() {
  Currency.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
