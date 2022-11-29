
const url = 'wss://stream.data.alpaca.markets/v1beta2/crypto';
const socket = new WebSocket(url);

const auth = {"action": "auth", "key": "PKTKAQF00020R8YRGZJJ", "secret": "c8LTXjFIff9g1bLCcWtxq0XiUyqToKTg1C5u9hkH"};
const subscribe = {"action":"subscribe","trades":["ETH/USD"],"quotes":["ETH/USD"],"bars":["ETH/USD"]};

const quotesElement = document.getElementById('quotes');
const tradesElement = document.getElementById('trades');

var chart = LightweightCharts.createChart(document.getElementById('chart'), {
	width: 600,
    height: 300,
	crosshair: {
		mode: LightweightCharts.CrosshairMode.Normal,
	},
});

var candleSeries = chart.addCandlestickSeries();

var data = [
	{ time: '2018-10-19', open: 54.62, high: 55.50, low: 54.52, close: 54.90 },
	{ time: '2018-10-22', open: 55.08, high: 55.27, low: 54.61, close: 54.98 },
	{ time: '2018-10-23', open: 56.09, high: 57.47, low: 56.09, close: 57.21 }
];

candleSeries.setData(data);

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
            console.log('got a quote');
            console.log(data[key]);

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
            console.log('got a trade');
            console.log(data[key]); 
            
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