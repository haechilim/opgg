const Server = require('./manager/server');

const server = new Server();

server.createServer();

/* databaseManager.connect();
databaseManager.getPosts(5, 3, (error, result) => console.log(error, result));
databaseManager.getPost(5, (error, result) => console.log(error, result));
databaseManager.getComments(1, (error, result) => console.log(error, result));
databaseManager.updatePost(10, "대한미국놈 부대찌게 손절", "ㅋㅋ", (error) => {
    if(error) console.log(error);
    else console.log("success");
});
databaseManager.getCategories((error, result) => console.log(error, result));
databaseManager.getMembers((error, result) => console.log(error, result)); */