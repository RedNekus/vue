const API_KEY = '66e21e158363f5ef11f27eed8ae4db7c3e20c12bb49b535c9602ac7836f3d20a';
const tickersHandlers = new Map(); //{}
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);
const AGGREGATE_INDEX = "5";

socket.addEventListener('message', e => {
    const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(e.data);
    //console.log(JSON.parse(e.data));
    if(type !== AGGREGATE_INDEX || newPrice === undefined) {
        return;
    }
    const handlers = tickersHandlers.get(currency) ?? [];
    handlers.forEach(fn => fn(newPrice));
});

//TODO: refactor to use URLSearchParams
/*const loadTickers = () => {
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
                handlers.forEach(fn => fn(newPrice));
            })
        });
};*/

function sendToWebSocket(message) {
    const stringifiedMessage = JSON.stringify(message);
    //console.log(stringifiedMessage);

    if(socket.readyState === WebSocket.OPEN) {
        socket.send(stringifiedMessage);
    } else {
        socket.addEventListener("open", () => {
            socket.send(stringifiedMessage);
        }, { 'once': true });
    }
}

function subscribeToTickerOnWs(ticker) {
    sendToWebSocket({
        "action": "SubAdd",
        "subs": [`5~CCCAGG~${ticker}~USD`]
    });
}
function unsubscribeToTickerOnWs(ticker) {
    sendToWebSocket({
        "action": "SubRemove",
        "subs": [`5~CCCAGG~${ticker}~USD`]
    });
}

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
    subscribeToTickerOnWs(ticker);
}

export const unsubscribeFromTicker = ticker => {
    /*const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, subscribers.filter(fn => fn !== cb));*/
    //tickersHandlers.delete(ticker);
    unsubscribeToTickerOnWs(ticker);
}
//setInterval(loadTickers, 5000)
//???????????????? ?????????????????? ?????????????????????? ?? ???????????????? ???????????????????? ???????????????????? ???????????? ????????????!!!!
//window.tickers = tickersHandlers;

//broadcast api???