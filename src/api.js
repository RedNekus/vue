const API_KEY = '66e21e158363f5ef11f27eed8ae4db7c3e20c12bb49b535c9602ac7836f3d20a';

//TODO: refactor to use URLSearchParams
export const loadTicker = (tickerName) =>
    fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=${API_KEY}`
    ).then(r => r.json());
