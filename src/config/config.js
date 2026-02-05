const config = {
    secret: '9238fSf9fAKckj332Knaksnf9012ADSN',
    env: process.env.ENV,
    port: 4000,
    get baseUrl() {
        return `http://localhost:${this.port}`;
    },
    db: {
        dbUrl: 'mongodb://127.0.0.1:27017',
        dbName: 'usersdb',
        dbHost: 'localhost',
        dbPort: 27017,
    },
    defaultAvatar: '/images/avatar-stub.png'
};

module.exports = config;