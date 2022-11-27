
const url = 'wss://stream.data.alpaca.markets/v1beta2/crypto';
const socket = new WebSocket(url);

const auth = {"action": "auth", "key": "PKTKAQF00020R8YRGZJJ", "secret": "c8LTXjFIff9g1bLCcWtxq0XiUyqToKTg1C5u9hkH"};

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);

    console.log(data);

    if(data[0]['msg'] == 'connected') {
        console.log('do authentication');
        socket.send(JSON.stringify(auth));
    }

    if(data[0]['msg'] == 'authenticated') {
        socket.send();
    }
};