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
            let parameter = this.getParameters(request.url);
            
            console.log(pathname);

            switch(pathname) {
                case "/list":
                    this.databaseManager.getPosts(parameter.limit, parameter.offset, (error, result) => {
                        if(error) console.log(error);
                        else this.jsonResponse(response, result);
                    });
                    break;

                case "/contents":
                    this.databaseManager.getPost(parameter.id, (error, result) => {
                        if(error) console.log(error);
                        else this.jsonResponse(response, result);
                    });
                    break;

                default:
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
                    break;
            }
        }).listen(7000);

        console.log("server start!");
    }

    jsonResponse(response, data) {
        if(data) {
            response.writeHead(200, {"content-type": "application/json; charset=utf-8"});
            response.end(JSON.stringify(data));
        }
    }

    getPathname(requestUrl) {
        return url.parse(requestUrl).pathname;
    }

    getParameters(requestUrl) {
        let result = {};
        let part = parameterPart();
        let parameters = part.split("&");
        
        for(let i = 0; i < parameters.length; i++) {
            let tokens = parameters[i].split("=");
            
            if(tokens.length < 2) continue;
            
            result[tokens[0]] = tokens[1];
        }
        
        return result;
        
        function parameterPart() {
            let tokens = requestUrl.split("?");
            
            return tokens.length > 1 ? tokens[1] : "";
        }
    }
}

module.exports = Server;