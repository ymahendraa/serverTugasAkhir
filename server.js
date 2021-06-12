require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
// const basicAuth = require('_helpers/basic-auth');
const errorHandler = require('_helpers/error-handler');
const rsa = require('node-rsa');

const https = require('https');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use basic HTTP auth to secure the api
// app.use(basicAuth);

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

httpsServer.listen(4000, () => {
    console.log('HTTPS Server running on port 4000');
});

// const broker = 
//     {
//         url: '180.250.135.100',
//         port : 8833
//     }
// var CryptoJS = require('crypto-js');

// // Encrypt
// let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(broker), 'tB-*Ds3k2%Pk2Rdl').toString();
// console.log(ciphertext)
// // Decrypt
// let bytes  = CryptoJS.AES.decrypt(ciphertext, 'tB-*Ds3k2%Pk2Rdl');
// let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

// console.log(decryptedData);
