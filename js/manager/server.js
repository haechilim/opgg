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

            switch(pathname) {
                case "/list":
                    this.databaseManager.getPosts(parameter.limit, parameter.offset, parameter.sort, (error, result) => error ? console.log(error) : this.jsonResponse(response, result));
                    break;

                case "/count":
                    this.databaseManager.getPostsCount((error, result) => error ? console.log(error) : this.jsonResponse(response, result));

                case "/contents":
                    this.databaseManager.getPost(parameter.id, (error, result) => error ? console.log(error) : this.jsonResponse(response, result));
                    break;

                case "/write":
                    let post = "";

                    request.on("data", (data) => post += data);

                    request.on("end", () => {
                        post = post.replace(/\+/gi, "%20");
                        post = decodeURIComponent(post);
                        const data = this.getParameters("?" + post);

                        this.databaseManager.writePost(data.title, data.contents, data.category, (error) => {
                            response.writeHead(200, {'Content-Type': 'text/html'});

                            response.end(this.getErrorHtml(error));
                        });
                    });
                    break;

                default:
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

    getErrorHtml(error) {
        return "<!DOCTYPE html>\n" +
        "<html lang=\"en\">\n" +
        "<head>\n" +
        "    <meta charset=\"UTF-8\">\n" +
        "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
        "    <title>OP.GG</title>\n" +
        "\n" +
        "    <style>\n" +
        "        html {\n" +
        "            height: 100%;\n" +
        "        }\n" +
        "\n" +
        "        body {\n" +
        "            height: 100%;\n" +
        "            display: flex;\n" +
        "            justify-content: center;\n" +
        "            align-items: center;\n" +
        "        }\n" +
        "\n" +
        "        div {\n" +
        "            font-size: 3rem;\n" +
        "            font-weight: bold;\n" +
        "        }\n" +
        "    </style>\n" +
        "\n" +
        "    <script>\n" +
        (error ? "\n" : "        location.href = \"main.html?sort=new&page=1\";\n") +
        "    </script>\n" +
        "</head>\n" +
        "<body>\n" +
        "    <div>ERROR: 새 글을 작성할 수 없습니다.</div>\n" +
        "</body>\n" +
        "</html>";
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