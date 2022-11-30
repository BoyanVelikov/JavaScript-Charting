
const url = 'wss://stream.data.alpaca.markets/v1beta2/crypto';
const socket = new WebSocket(url);

const API_KEY = 'PKTKAQF00020R8YRGZJJ';
const SECRET_KEY = 'c8LTXjFIff9g1bLCcWtxq0XiUyqToKTg1C5u9hkH';

const auth = {"action": "auth", "key": API_KEY, "secret": SECRET_KEY};
const subscribe = {"action":"subscribe","trades":["ETH/USD"],"quotes":["ETH/USD"],"bars":["ETH/USD"]};

const quotesElement = document.getElementById('quotes');
const tradesElement = document.getElementById('trades');

var chart = LightweightCharts.createChart(document.getElementById('chart'), {
	width: 700,
    height: 700,
	layout: {
        backgroundColor: '#000000',
        textColor: '#ffffff'
    },
    grid: {
        vertLines: {
            color: '#404040'
        },
        horzLines: {
            color: '#404040'
        }
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal
    },
    priceScale: {
        borderColor: '#cccccc'
    },
    timeScale: {
        borderColor: '#cccccc',
        timeVisible: true
    }
});

var candleSeries = chart.addCandlestickSeries();

var start = new Date(Date.now() - (7200 * 1000)).toISOString();

console.log(start);

var bars_url = 'https://data.alpaca.markets/v1beta1/crypto/ETHUSD/bars?exchanges=CBSE&timeframe=1Min&start=' + start;

fetch(bars_url, {
    headers: {
        'APCA-API-KEY-ID': API_KEY,
        'APCA-API-SECRET-KEY': SECRET_KEY
    }
}).then((r) => r.json())
    .then((response) => {
        console.log(response);

        const data = response.bars.map(bar => ({
            open: bar.o,
            high: bar.h,
            low: bar.l,
            close: bar.c,
            time: Date.parse(bar.t) / 1000
        }));

        console.log(data);
        
        candleSeries.setData(data);
    });

// var data = [
// 	{ time: '2018-10-19', open: 54.62, high: 55.50, low: 54.52, close: 54.90 },
// 	{ time: '2018-10-22', open: 55.08, high: 55.27, low: 54.61, close: 54.98 },
// 	{ time: '2018-10-23', open: 56.09, high: 57.47, low: 56.09, close: 57.21 },
// 	{ time: '2018-10-24', open: 57.00, high: 58.44, low: 56.41, close: 57.42 },
// 	{ time: '2018-10-25', open: 57.46, high: 57.63, low: 56.17, close: 56.43 },
// 	{ time: '2018-10-26', open: 56.26, high: 56.62, low: 55.19, close: 55.51 },
// 	{ time: '2018-10-29', open: 55.81, high: 57.15, low: 55.72, close: 56.48 },
// 	{ time: '2018-10-30', open: 56.92, high: 58.80, low: 56.92, close: 58.18 },
// 	{ time: '2018-10-31', open: 58.32, high: 58.32, low: 56.76, close: 57.09 },
// 	{ time: '2018-11-01', open: 56.98, high: 57.28, low: 55.55, close: 56.05 },
// 	{ time: '2018-11-02', open: 56.34, high: 57.08, low: 55.92, close: 56.63 },
// 	{ time: '2018-11-05', open: 56.51, high: 57.45, low: 56.51, close: 57.21 },
// 	{ time: '2018-11-06', open: 57.02, high: 57.35, low: 56.65, close: 57.21 },
// 	{ time: '2018-11-07', open: 57.55, high: 57.78, low: 57.03, close: 57.65 },
// 	{ time: '2018-11-08', open: 57.70, high: 58.44, low: 57.66, close: 58.27 },
// 	{ time: '2018-11-09', open: 58.32, high: 59.20, low: 57.94, close: 58.46 },
// 	{ time: '2018-11-12', open: 58.84, high: 59.40, low: 58.54, close: 58.72 },
// 	{ time: '2018-11-13', open: 59.09, high: 59.14, low: 58.32, close: 58.66 }
// ];

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    const message = data[0]['msg'];

    if(message == 'connected') {
        console.log('do authentication');
        socket.send(JSON.stringify(auth));
    }

    if(message == 'authenticated') {
        socket.send(JSON.stringify(subscribe));
    }

    for (key in data) {

        const type = data[key].T;

        if (type == 'q') {
            // console.log('got a quote');
            // console.log(data[key]);

            const quoteElement = document.createElement('div');
            quoteElement.className = 'quote';
            quoteElement.innerHTML = `<b>${data[key].t}<b/> ${data[key].bp} ${data[key].ap}`;
            quotesElement.appendChild(quoteElement);

            var elements = document.getElementsByClassName('quote');
            if (elements.length > 10) {
                quotesElement.removeChild(elements[0]);
            }
        }

        if (type == 't') {
            // console.log('got a trade');
            // console.log(data[key]); 
            
            const tradeElement = document.createElement('div');
            tradeElement.className = 'trade';
            tradeElement.innerHTML = `<b>${data[key].t}<b/> ${data[key].p} ${data[key].s}`;
            tradesElement.appendChild(tradeElement);

            var elements = document.getElementsByClassName('trade');
            if (elements.length > 10) {
                tradesElement.removeChild(elements[0]);
            }
        }

        if (type == 'b') {
            console.log('got a new bar');
            console.log(data[key]);
        }
    }
};