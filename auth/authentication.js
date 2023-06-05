const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;

const sign=promisify(jwt.sign).bind(jwt);
const verify=promisify(jwt.verify).bind(jwt);

exports.generateToken = async(payload, secretKey, tokenLife) =>{
    try {
        return await sign(
            {
                algorithm: 'HS256',
                expiresIn: tokenLife,
            },
            {
                payload,
            },
            secretKey,
        );
    } catch (error) {
        console.log(`Error create Token: ${error}`);
        return null;
    }
};

exports.verifyToken = async (token, secretKey) => {
    try {
        return await verify (token, secretKey);
    } catch (error) {
        console.log(`Error verify Token: ${error}`);
        return null;
    }
};

exports.decodeToken = async (token, secretKey) =>{
    try {
        return await verify((token, secretKey), {ignoreExpiration: true,});
    } catch (error) {
        console.log(`Error decoding access token: ${error}`);
        return null;
    }
};