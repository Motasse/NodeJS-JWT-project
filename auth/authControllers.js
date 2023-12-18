const randToken = require('rand-token');
const bcrypt = require('bcrypt');

const userModel = require('../users/userModel');
const authentication = require('./authentication');

exports.register = async (req, res) => {
    const username = req.body.username.toLowerCase();
    const user = await userModel.getUser(username);
    const adminCheck = req.body.isAdmin;
    console.log(user[0]);
    if (user[0]) res.status(409).send('Username existed');
    else{
        const hashPass = bcrypt.hashSync(req.body.password, 10);
        const newUser = {username: username, password: hashPass, isAdmin: adminCheck};
        const createUser = await userModel.createUser(newUser);
        if(!createUser){
            return res.status(400).send('Error when creating new user');
        }
        return res.send({username,});
    }
    
};

exports.login = async (req, res) =>{
    const username = req.body.username.toLowerCase();
    const password = req.body.password;

    const user = await userModel.getUser(username);
    console.log('user', user[0].username);
    if(!user) return res.status(401).send('Username not found');
    
    const checkPassword = bcrypt.compareSync(password, user[0].password);
    if(!checkPassword) res.status(401).send('Incorrect password');

    console.log('sKey', process.env.SECRET_KEY);
    console.log('tokLife', process.env.ACCESS_TOKEN_LIFE);
    const accessToken = await authentication.generateToken(
        {username: user[0].username},
        process.env.SECRET_KEY,
        process.env.ACCESS_TOKEN_LIFE
    );
    if (!accessToken) return res.status(401).send('Error creating access token');

    let refreshToken = randToken.generate(50);
    if(!user[0].refreshToken) await userModel.updateRefreshToken(user[0].username, refreshToken);
    else refreshToken=user[0].refreshToken;

    return res.json({
        msg:"Access granted",
        accessToken,
        refreshToken,
        user,
    });
};