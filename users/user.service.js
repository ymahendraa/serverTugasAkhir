// users hardcoded for simplicity, store in a db for production applications
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
        password: 'wMOAePoEsXwMt7TbZ2lu', 
        firstName: 'Mahen', 
        lastName: 'Dor' 
    },
];

const broker = 
    {
        url: '180.250.135.100',
        port : 8833
    }


module.exports = {
    authenticate,
    getAll
};

async function authenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}

async function getAll() {
        return broker;
}
