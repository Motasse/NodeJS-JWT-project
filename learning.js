const http = require('http');
const express = require('express');
const url = require('url');
const fs = require('fs');
const mysql = require('mysql2');
require('dotenv').config();
const bodyParser = require('body-parser');

const sql = mysql.createConnection({
    host:"localhost",
    port:3330,
    user:process.env.DBUSER,
    password:process.env.DBPASS,
    database:"mydb",
});
/*sql.connect(function(err){
    if (err) throw err;
    console.log("Connected");
    const db_init = "CREATE DATABASE IF NOT EXISTS mydb";
    const sql_init = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), password VARCHAR(255), refreshToken VARCHAR(255))";
    sql.query(sql_init, function(err, result){
        if(err) throw err;
        console.log("Done initialization");
    });
});*/

const authRoute = require('./auth/auth.routes');
const userRoute = require('./users/user.routes');
const app = express();

app.get('/', (req, res) =>{
    res.send('APP IS RUNNING');
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.message);
});

const server = app.listen(process.env.PORT || 8088, function(err) {
    if(err) console.log(err);
    console.log(`It\'s Alive on port ${server.address().port}`);
});

app.use('/auth', authRoute);
app.use('/user', userRoute);

//app.use('/auth', authRoute);
/*http.createServer(function(req, res){
    var q = url.parse(req.url, true);
    var filename = "."+q.pathname;
    fs.readFile(filename, function(err, data){
        if(err){
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found")
        }
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        return res.end();
    });
}).listen(8080);*/

