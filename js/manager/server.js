const http = require('http');

class Server {
    constructor() {

    }

    createServer() {
        http.createServer((request, response) => {
            console.log(request.url);
        }).listen(7000);
        console.log("server start!");
    }    
}

module.exports = Server;