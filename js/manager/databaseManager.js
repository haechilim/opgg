const mysql = require('mysql');

class DatabaseManager {
    constructor() {

    }

    connect() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'gocl213@',
            database: 'opgg'
        });
        this.connection.connect();
    }

    disconnect() {
        this.connection.end();
    }

    getPosts(limit, offset, sort, callback) {
        let sortQuery;

        switch(sort) {
            case "new":
                sortQuery = "p.dateTime";
                break;
            
            case "top":
                sortQuery = "(p.like - p.dislike)";
                break;
        }

        const query = "select p.id, p.title, p.like, p.dislike, p.dateTime, " +
        "m.name as mname, m.level as mlevel, " +
        "c.name as category, c.id as categoryId," +
        "(select count(*) from opgg.comment where postId=p.id) as ccount " +
        "from post as p " +
        "left join member as m " +
        "on p.member = m.id " +
        "left join category as c " +
        "on p.category = c.id " +
        "order by " + sortQuery + " desc " +
        "limit " + limit + " offset " + offset + ";"

        this.query(query, callback);
    }

    getPost(postId, callback) {
        const query = "select p.title, p.contents, p.like, p.dislike, p.count, p.dateTime, " +
        "m.name as mname, m.level as mlevel, " +
        "c.name as category, c.id as categoryId," +
        "(select count(*) from opgg.comment where postId=p.id) as ccount " +
        "from post as p " +
        "left join member as m " +
        "on p.member = m.id " +
        "left join category as c " +
        "on p.category = c.id " +
        "where p.id = " + postId + ";"

        this.query(query, (error, result) => callback(error, result[0]));
    }

    getPostsCount(callback) {
        this.query('select count(*) as count from opgg.post;', (error, result) => callback(error, error == undefined ? result[0].count : 0));
    }

    getCommentsCount(id, callback) {
        this.query("SELECT count(*) as count FROM opgg.comment where postId = " + id + ";", (error, result) => callback(error, error == undefined ? result[0].count : 0));
    }

    writePost(title, contents, category, callback) {
        const query = "insert into opgg.post(title, contents, `like`, dislike, count, dateTime, member, category) values('" + title + "', '" + contents + "', 0, 0, 0, now(), 2, " + category + ");";

        this.query(query, callback);
    }

    editPost(postId, title, contents, category, callback) {
        this.query('update opgg.post set title = "' + title + '", contents = "' + contents + '", category = ' + category + ' where id = ' + postId + ';', callback);
    }
    
    getComments(postId, sort, callback) {
        const sortQuery = sort == "top" ? "c.like - c.dislike" : "c.dateTime";

        const query = "select c.id, c.postId, c.parentId, c.contents, c.like, c.dislike, c.dateTime, m.name, m.level, c.warned " +
        "from comment as c " +
        "left join member as m " +
        "on c.member = m.id " +
        "where c.postId = " + postId + " " +
        "order by (" + sortQuery + ") desc;";

        this.query(query, callback);
    }
    
    like(postId, callback) {
        this.query('update opgg.post set `like` = `like` + 1 where id = ' + postId + ';', callback);
    }

    dislike(postId, callback) {
        this.query('update opgg.post set dislike = dislike + 1 where id = ' + postId + ';', callback);
    }
    
    count(postId, callback) {
        this.query('update opgg.post set count = count + 1 where id = ' + postId + ';', callback);
    }
    
    addComment(postId, contents, callback) {
        const query = "insert into opgg.comment(postId, parentId, contents, `like`, dislike, dateTime, member, warned) values(" + postId + ", 0, '" + contents + "', 0, 0, now(), 1, 0);"

        this.query(query, callback);
    }

    getCategories(callback) {
        this.query('SELECT * FROM opgg.category;', callback);
    }

    getMembers(id, callback) {
        this.query('SELECT * FROM opgg.member;', callback);
    }

    query(query, callback) {
        this.connection.query(query, callback);
    }
}

module.exports = DatabaseManager;