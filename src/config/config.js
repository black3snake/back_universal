const path = require('path');
const dotenv = require('dotenv');
const envFile = process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';

const envPath = path.join(process.cwd(), envFile);
dotenv.config({ path: envPath });

const config = {
    secret: process.env.SECRET || '9238fSf9fAKckj332Knaksnf9012ADSN',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 4000,
    inspectPort: process.env.INSPECT_PORT || 4004,

    get baseUrl() {
        if (this.env === 'production') {
            return process.env.BASE_URL || 'https://site080.podderzka-irk.ru';
        }
        return process.env.BASE_URL || `http://localhost:${this.port}`;
    },

    get frontendUrl() {
        if (this.env === 'production') {
            return process.env.FRONTEND_URL || 'https://site080.podderzka-irk.ru';
        }
        return process.env.FRONTEND_URL || 'http://localhost:4200';
    },

    db: {
        dbUrl: process.env.DB_URL || 'mongodb://127.0.0.1:27017',
        dbName: process.env.DB_NAME || (this.env === 'production' ? 'usersdb_prod' : 'usersdb_dev'),
        dbHost: process.env.DB_HOST || 'localhost',
        dbPort: process.env.DB_PORT || 27017,
    },

    defaultAvatar: process.env.DEFAULT_AVATAR || '/images/avatar-stub.png',
    MAX_USERS: process.env.MAX_USERS || 23,
    USER_LIMIT_MESSAGE: process.env.USER_LIMIT_MESSAGE || 'Достигнут лимит пользователей в системе',
    MIN_USERS: process.env.MIN_USERS || 10,
};

// Логируем конфигурацию при запуске (кроме секретов)
// console.log('Конфигурация загружена:');
// console.log(`Окружение: ${config.env}`);
// console.log(`Base URL: ${config.baseUrl}`);
// console.log(`Frontend URL: ${config.frontendUrl}`);
// console.log(`База данных: ${config.db.dbUrl}/${config.db.dbName}`);
// console.log(`Порт: ${config.port}`);

module.exports = config;
