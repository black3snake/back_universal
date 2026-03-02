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
    defaultAvatar: '/images/avatar-stub.png',
    MAX_USERS: process.env.MAX_USERS || 23,
    USER_LIMIT_MESSAGE: 'Достигнут лимит пользователей в системе',
    MIN_USERS: process.env.MIN_USERS || 10,
};

module.exports = config;