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
            console.log(request.url);

            let pathname = this.getPathname(request.url);
            let parameter = this.getParameters(request.url);
            let post = "";

            request.on("data", (data) => post += data);
            request.on("end", () => {
                console.log(post);
                const data = this.getParameters("?" + post);

                let title = decodeURIComponent(data.title);
                let contents = decodeURIComponent(data.contents);

                if(pathname == "/write") {
                    this.databaseManager.writePost(title, contents, data.category, (error) => {
                        error ? console.log(error) : this.jsonResponse(response, {success: (error ? false : true)});
                    });
                }
                else if(pathname == "/edit") {
                    this.databaseManager.editPost(data.id, title, contents, data.category, (error) => {
                        error ? console.log(error) : this.jsonResponse(response, {success: (error ? false : true)});
                    });
                }
            });

            switch(pathname) {
                case "/list":
                    this.databaseManager.getPosts(parameter.limit, parameter.offset, parameter.sort, (error, result) => error ? console.log(error) : this.jsonResponse(response, result));
                    break;

                case "/count":
                    this.databaseManager.getPostsCount((error, result) => error ? console.log(error) : this.jsonResponse(response, result));

                case "/contents":
                    this.databaseManager.getPost(parameter.id, (error, result) => error ? console.log(error) : this.jsonResponse(response, result));
                    break;

                default:
                    if(pathname == "/write" || pathname == "/edit") break;
                    this.pageResponse(response, pathname);
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

    pageResponse(response, pathname) {
        response.writeHead(200, {'Content-Type': mime.getType(pathname)});

        fs.readFile("./" + pathname, (err, data) => {
            if (err) {
                console.log(err);

                response.writeHead(404);
                response.end(data);
            }
            else if(mime.getType(pathname).split('/')[0] == "text") response.end(data, 'utf-8');
            else response.end(data);
        });
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