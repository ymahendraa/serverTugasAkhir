const userService = require('../users/user.service');
const rsa = require('node-rsa');
const fs = require('fs');

module.exports = basicAuth;

async function basicAuth(req, res, next) {
    // make authenticate path public
    if (req.path === '/users/authenticate') {
        return next();
    }

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    var publicKey = new rsa();
    var privateKey = new rsa();
    privateKey.setOptions({encryptionScheme: 'pkcs1'});

    var public = fs.readFileSync('serverTA_public.key');
    var private = fs.readFileSync('serverTA.key');

    publicKey.importKey(public);
    privateKey.importKey(private);

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    console.log(credentials)
    var decryptedAuthPay = privateKey.decrypt(credentials,'utf8');
    const [username, password] = decryptedAuthPay.split(':::');
    // const [username, password] = credentials.split(':::');
    const user = await userService.authenticate({ username, password });
    if (!user) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }

    // attach user to request object
    req.user = user

    next();
}