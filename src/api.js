const API_KEY = '66e21e158363f5ef11f27eed8ae4db7c3e20c12bb49b535c9602ac7836f3d20a';
const tickersHandlers = new Map(); //{}

//TODO: refactor to use URLSearchParams
const loadTickers = () => {
    if(tickersHandlers.size === 0) { return; }

    fetch(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()].join(",")}&tsyms=USD&api_key=${API_KEY}`
    )
        .then(r => r.json())
        .then(rawData => {
            const updatedPrices = Object.fromEntries(
                Object.entries(rawData).map(([key, value]) => [key, value.USD])
            );

            Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
                const handlers = tickersHandlers.get(currency) ?? [];
                handlers.forEach(fn => fn(newPrice))
            })
        });

};

export const subcribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
}

export const unsubcribeFromTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, subscribers.filter(fn => fn !== cb));
}
setInterval(loadTickers, 5000)
//Получать стоимость криптовалют и получать обновления стоимостии разные задачи!!!!
window.tickers = tickersHandlers;