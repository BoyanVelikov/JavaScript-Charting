
const url = 'wss://stream.data.alpaca.markets/v1beta2/crypto';
const socket = new WebSocket(url);

const auth = {"action": "auth", "key": "PKTKAQF00020R8YRGZJJ", "secret": "c8LTXjFIff9g1bLCcWtxq0XiUyqToKTg1C5u9hkH"};
const subscribe = {"action":"subscribe","trades":["ETH/USD"],"quotes":["ETH/USD"],"bars":["ETH/USD"]};

const quotesElement = document.getElementById('quotes');
const tradesElement = document.getElementById('trades');

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
        }

        if (type == 't') {
            console.log('got a trade');
            console.log(data[key]); 
            
            const tradeElement = document.createElement('div');
            tradeElement.innerHTML = `<b>${data[key].t}<b/> ${data[key].p} ${data[key].s}`;
            tradesElement.appendChild(tradeElement);
        }

        if (type == 'b') {
            console.log('got a new bar');
            console.log(data[key]);
        }
    }
};