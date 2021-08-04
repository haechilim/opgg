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

    getPosts(limit, offset, callback) {
        const query = "select p.id, p.title, p.like, p.dislike, p.dateTime, " +
        "m.name as mname, m.level as mlevel, " +
        "c.name as category, " +
        "(select count(*) from opgg.comment where postId=p.id) as ccount " +
        "from post as p " +
        "left join member as m " +
        "on p.member = m.id " +
        "left join category as c " +
        "on p.category = c.id " +
        "order by p.dateTime desc " +
        "limit " + limit + " offset " + offset + ";"

        this.query(query, callback);
    }

    getPost(postId, callback) {
        const query = "select p.title, p.contents, p.like, p.dislike, p.count, p.dateTime, " +
        "m.name as mname, m.level as mlevel, " +
        "c.name as category, " +
        "(select count(*) from opgg.comment where postId=p.id) as ccount " +
        "from post as p " +
        "left join member as m " +
        "on p.member = m.id " +
        "left join category as c " +
        "on p.category = c.id " +
        "where p.id = " + postId + ";"

        this.query(query, callback);
    }
    
    getComments(postId, callback) {
        const query = "select c.id, c.postId, c.parentId, c.contents, c.like, c.dislike, c.dateTime, m.name, m.level, c.warned " +
        "from comment as c " +
        "left join member as m " +
        "on c.member = m.id " +
        "where c.postId = " + postId + ";";

        this.query(query, callback);
    }

    updatePost(postId, title, contents, callback) {
        this.query('update opgg.post set title = "' + title + '", contents = "' + contents + '" where id = ' + postId + ';', callback);
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
    
    addComment(postId, parentId, contents, member, callback) {
        const query = "insert into opgg.comment(postId, parentId, contents, `like`, dislike, dateTime, member, warned) values(" + postId + ", " + parentId + ", '" + contents + "', 0, 0, now(), " + member + ", 0);"

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