const http = require('http');
const url = require('url');
const fs = require('fs');
const mime = require('mime');
const DatabaseManager = require('./databaseManager');

class Server {
    constructor() {
        this.databaseManager = new DatabaseManager();
        this.databaseManager.connect();
    }

    createServer() {
        http.createServer((request, response) => {
            let pathname = this.getPathname(request.url);

            response.writeHead(200, {'Content-Type': mime.getType(pathname)});

            fs.readFile("./" + pathname, (err, data) => {
                if (err) {
                    console.error(err);
                    response.writeHead(404);
                    response.end(data);
                }
                else if(mime.getType(pathname).split('/')[0] == "text") response.end(data, 'utf-8');
                else response.end(data);
            });
        }).listen(7000);

        console.log("server start!");
    }

    getPathname(requestUrl) {
        return url.parse(requestUrl).pathname;
    }
}

module.exports = Server;