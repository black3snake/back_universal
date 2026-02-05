const mongoose = require('mongoose');
const config = require('../../config/config');

class MongoDBConnection {
    static isConnected = false;
    static db;

    static async getConnection(result) {
        if (this.isConnected) {
            return result(null, this.db);
        }

        return this.connect(result);
    }

    static async connect(result) {
        try {
            await mongoose.connect(config.db.dbUrl, {
                dbName: config.db.dbName,
                maxPoolSize: 10, // максимальное количество соединений в пуле
                serverSelectionTimeoutMS: 5000, // таймаут выбора сервера
                socketTimeoutMS: 45000, // таймаут сокета
                family: 4, // использовать IPv4
            });

            this.db = mongoose;
            this.isConnected = true;

            console.log('MongoDB connected successfully!');

            // Базовые слушатели
            mongoose.connection.on('error', (error) => {
                console.error('MongoDB connection error:', error);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                console.log('MongoDB disconnected');
                this.isConnected = false;
            });

            return result(null, this.db);

        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            this.isConnected = false;
            return result(error, null);
        }
    }
}

module.exports = MongoDBConnection;
