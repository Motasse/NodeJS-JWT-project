const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const db = lowdb(new FileSync('data.json'));
const mysql = require('mysql2');
const { resolve } = require('url');

const TABLENAME = 'users';

const sql = mysql.createConnection({
    host:"localhost",
    port:3330,
    user:process.env.DBUSER,
    password:process.env.DBPASS,
    database:"mydb",
});

exports.createUser =  async user => {
    try {
        sql.query(`INSERT INTO ${TABLENAME} (username, password) VALUES ('${user.username}', '${user.password}')`, function(err, result){
            if (err) throw err;
            console.log('Successfully inserted');
        });
        return true;
    } catch {
        return false;
    }
};

exports.userProfile = (req, res) => {
    const username = req.body.username.toLowerCase();
    sql.query(`SELECT * FROM ${TABLENAME} WHERE username = '${username}'`, function(err, result, fields){
        if(err) throw err;
        res.json(result);
    });
};
exports.getInfoById = (req, res) =>{
    const id = req.params.userId;
    sql.query(`SELECT * FROM ${TABLENAME} WHERE id=${id}`, function(err, result){
        if (err) throw err;
        res.json(result);
    });
};
exports.getSpecific = (req, res) => {
    const user_id=req.query.id;
    const getRefreshToken=req.query.refreshToken;
    console.log('f5Token', getRefreshToken);
    if (getRefreshToken === 'true'){
        sql.query(`SELECT refreshToken FROM ${TABLENAME} WHERE id=${user_id}`, function(err, result){
            if(err) throw err;
            res.json(result);
        });
    }
};
exports.getUser = async username => {
    const queri = `SELECT * FROM ${TABLENAME} WHERE username = ?`;
    const data = await new Promise(function(resolve, reject){
        sql.query(queri,[username], function(err, result, fields){
            if(err) throw err;
            //data = result.map(v => Object.assign({}, v));
            resolve(result);
            //console.log('data', data);
        });
    });
    return data;
};

exports.updateRefreshToken = async (username, refreshToken) =>{
    try {
        sql.query(`UPDATE ${TABLENAME} SET refreshToken ='${refreshToken}' WHERE username='${username}'`, async function (err,result){
            if (err) throw err;
            return true;
        });
    } catch {
        return false
    }
}