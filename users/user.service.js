// users hardcoded for simplicity, store in a db for production applications
var CryptoJS = require('crypto-js');
const rsa = require('node-rsa');
const fs = require('fs');
const config = require('config.json');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

var publicKey = new rsa();
var privateKey = new rsa();
privateKey.setOptions({encryptionScheme: 'pkcs1'});

var public = fs.readFileSync('serverTA_public.key');
var private = fs.readFileSync('serverTA.key');

publicKey.importKey(public);
privateKey.importKey(private);

const users = [
    {   id: 1, 
        username: 'test', 
        password: 'test', 
        firstName: 'Test', 
        lastName: 'User' 
    },
    {   id: 2, 
        username: 'tesst', 
        password: 'tesst', 
        firstName: 'Testi', 
        lastName: 'Moni' 
    },
    {   id: 3, 
        username: 'mahen12', 
        password: 'tB-*Ds3k2%Pk2Rdl', 
        firstName: 'Mahen', 
        lastName: 'Dor' 
    },
];

const broker = 
    {
        url: '192.168.8.140',
        port : '4444',
        K1 : "jXn2r5u8x/A?D(G+"
    }


module.exports = {
    authenticate,
    getAll,
    getAllUser,
    getById,
    create,
};

async function authenticate({ clientID, key }) {
    // const decPayload = Buffer.from(payload, 'base64').toString('ascii');
    // var decryptedAuthPay = privateKey.decrypt(decPayload,'utf8');
    // const [username, password] = decryptedAuthPay.split(':::');
    const user = await User.findOne({ clientID });
    // const user = users.find(u => u.username === username && u.password === password);
    const pass = key === user.key;
    if (user && pass) {
        // const user = users.find(u => u.username === username && u.password === password);
        // Encrypt
        let encKey = key
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(broker), encKey).toString();
        console.log(ciphertext)
        return ciphertext
    }
}

async function getAll() {
    // const user = users.find(u => u.username === username && u.password === password);
    // // Encrypt
    // let encKey = user.password
    // let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(broker), encKey).toString();
    // console.log(ciphertext)
    return broker
}

async function getAllUser() {
    return await User.find();
}

async function getById(id) {
    return await User.findById(id);
}

async function create(userParam) {
    // const decPayload = Buffer.from(payload, 'base64').toString('ascii');
    // var decryptedAuthPay = privateKey.decrypt(decPayload,'utf8');
    // const [username, password] = decryptedAuthPay.split(':::');

    // validate
    if (await User.findOne({ clientID: userParam.clientID })) {
        throw 'Client ID "' + userParam.clientID + '" is already taken';
    }
    
    const user = new User(userParam);

    // hash password
    if (userParam.key) {
        user.hash = userParam.key;
    }

    // save user
    await user.save();
}



