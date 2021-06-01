require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const basicAuth = require('_helpers/basic-auth');
const errorHandler = require('_helpers/error-handler');
const rsa = require('node-rsa');

const https = require('https');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use basic HTTP auth to secure the api
app.use(basicAuth);

// api routes
app.use('/users', require('./users/users.controller'));


// global error handler
app.use(errorHandler);

// start server
// const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
// const server = app.listen(port, function () {
//     console.log('Server listening on port ' + port);
// });

// // listen to https
const httpsServer = https.createServer({
    key: fs.readFileSync('serverTA.key'),
    cert: fs.readFileSync('serverTA.crt'),
}, app);

httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});

// var message = 'hallo'

var publicKey = new rsa();
var privateKey = new rsa();
privateKey.setOptions({encryptionScheme: 'pkcs1'});

var public = fs.readFileSync('serverTA_public.key');
var private = fs.readFileSync('serverTA.key');

publicKey.importKey(public);
privateKey.importKey(private);

var secretMessage = `r2xzYMrxQk6rIokSje9pOAK4EmYzzjMzbaXBBf0yAwwe/WOuGl0bu3MFDOLzbHbGU61B0iF7vRYy
dnaSHuqya1HWTAs0qh7nWKFEg0y4axXhzRrTemIxDCTvc4izGqLWUR7X3HdLJsqZfhmNPssC6EbJ
m0MwSMjx8qdbgj3rGiA=`
var decrypted = privateKey.decrypt(secretMessage,'utf8');
console.log(decrypted)
// const publicKey = `-----BEGIN PUBLIC KEY-----
// MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC+Df4ahX8/VRSMZbL8s+yK68sH
// iRDWv1Mm82ALoz4sRfS0IiBe2QSpF6h1/kMWeF/kPTTYYlvnamEndOw4ghTkf0ZM
// g37WlQ4YCYiT8UrmzVDtgZmRg6JLB/S60OIpl99sGzlymWJOxJsQGiRTLd7PKhdg
// mP5yab2lmaJUiRA2sQIDAQAB
// -----END PUBLIC KEY-----`

// const privateKey = `-----BEGIN RSA PRIVATE KEY-----
// MIICXAIBAAKBgQC+Df4ahX8/VRSMZbL8s+yK68sHiRDWv1Mm82ALoz4sRfS0IiBe
// 2QSpF6h1/kMWeF/kPTTYYlvnamEndOw4ghTkf0ZMg37WlQ4YCYiT8UrmzVDtgZmR
// g6JLB/S60OIpl99sGzlymWJOxJsQGiRTLd7PKhdgmP5yab2lmaJUiRA2sQIDAQAB
// AoGAI7ULTb5RJvv8LViaJUJEqeEdNyA4arBtlf7Zx7X242iNTh6vSEKrzn0kaG7J
// +fnJwl8Bg7oPHE5vTHN6Qi+mbujQS55aPTD9he7llAFYKXvZhWtEKUEBVg4fNwNj
// pVKeKQ/HQV9Yb/Hy9TXaGc2xDX/BWKiGW88JvXKw1GNHFvECQQDkHUBXIR5SUxKN
// vQFLvTIA62E9OF7jruQ7i2EdSraOgA4bTuzilslSR4qc2tHJIYM18/2lYN6NCWcr
// GT6SIGNNAkEA1UmuNITmSYj/8cYQtE/LS0jEfZBR+Wb/mmH3fi+/6pd9JVqqgG4v
// LTK1uoKgJdQpsawpgjiMCVS9lK5ncULm9QJBALyAH4bgazoEQ7S0lrmLoiJ4X2ZD
// isYC478AskOOVcTztLSER+QGTl6bl8N+XxUhiFexQ8zBe6Z4OrS2q6n88ZECQAF7
// 6cJjylZopZ9BCYy3oWp8ryFQh8F8ffrNA7PVETjIpQ5Fezo5igp+d9U8Y3Df8QpT
// cFZ/njnSZR9Lt1yKYqECQAcyD8Ot50W0HDlKc1Jh0vAkIsK0s5RwBFu+LzYGOQcQ
// lBjPHbx0FuSLqKWrHvnWh2j+mTx1FRPH6mefCdTWnV4=
// -----END RSA PRIVATE KEY-----`

// const privateKey = '-----BEGIN RSA PRIVATE KEY-----\n'+
// 'MIICXAIBAAKBgQC+Df4ahX8/VRSMZbL8s+yK68sHiRDWv1Mm82ALoz4sRfS0IiBe\n' +
// '2QSpF6h1/kMWeF/kPTTYYlvnamEndOw4ghTkf0ZMg37WlQ4YCYiT8UrmzVDtgZmR\n' +
// 'g6JLB/S60OIpl99sGzlymWJOxJsQGiRTLd7PKhdgmP5yab2lmaJUiRA2sQIDAQAB\n' +
// 'AoGAI7ULTb5RJvv8LViaJUJEqeEdNyA4arBtlf7Zx7X242iNTh6vSEKrzn0kaG7J\n' +
// '+fnJwl8Bg7oPHE5vTHN6Qi+mbujQS55aPTD9he7llAFYKXvZhWtEKUEBVg4fNwNj\n' +
// 'pVKeKQ/HQV9Yb/Hy9TXaGc2xDX/BWKiGW88JvXKw1GNHFvECQQDkHUBXIR5SUxKN\n' +
// 'vQFLvTIA62E9OF7jruQ7i2EdSraOgA4bTuzilslSR4qc2tHJIYM18/2lYN6NCWcr\n' +
// 'GT6SIGNNAkEA1UmuNITmSYj/8cYQtE/LS0jEfZBR+Wb/mmH3fi+/6pd9JVqqgG4v\n' +
// 'LTK1uoKgJdQpsawpgjiMCVS9lK5ncULm9QJBALyAH4bgazoEQ7S0lrmLoiJ4X2ZD\n' +
// 'isYC478AskOOVcTztLSER+QGTl6bl8N+XxUhiFexQ8zBe6Z4OrS2q6n88ZECQAF7\n' +
// '6cJjylZopZ9BCYy3oWp8ryFQh8F8ffrNA7PVETjIpQ5Fezo5igp+d9U8Y3Df8QpT\n' +
// 'cFZ/njnSZR9Lt1yKYqECQAcyD8Ot50W0HDlKc1Jh0vAkIsK0s5RwBFu+LzYGOQcQ\n' +
// 'lBjPHbx0FuSLqKWrHvnWh2j+mTx1FRPH6mefCdTWnV4=\n' +
// '-----END RSA PRIVATE KEY-----'

// let keyPublic = new NodeRSA(publicKey);
// let keyPrivate = new NodeRSA(privateKey);
// var secret = 'hello'
// var encryptedString = keyPublic.encrypt(secret,'base64')
// console.log(encryptedString);
// var secretMessage = `PMSTTL1ZaykuVOEUdZQmyRE+41IRmy4z2UK3M2+330gBCpZOeDljrtDYZO2GwYwdwirdVfUz53EF
// JEbUI0N0k2PNkNbsd3Q2AWLe6aEu6xt/SvPKkLGZYtPJzEpbCYdvK/QpBeLq1/x/Tfzq1SUxYWql`
// var decryptedString = keyPrivate.decrypt(secretMessage, 'utf8')
// console.log(decryptedString)