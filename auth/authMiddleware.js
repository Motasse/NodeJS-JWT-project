const jwt = require('./authentication');
const accessTokenSecret = process.env.SECRET_KEY;

exports.isAuth = async (req, res, next) => {
    const accessTokenFromReq = req.body.token || req.query.token || req.headers["x-access-token"];
    if(!accessTokenFromReq) {
        return res.status(401).send('There is no valid Token available');
    }
    const verified = await jwt.verifyToken (
        accessTokenFromReq,
        accessTokenSecret,
    );
    if(!verified){
        return res.status(401).send('Unauthorized');
    }

    return next();
};

exports.isAdmin = async (req, res, next) =>{
    
};