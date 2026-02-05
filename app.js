const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/routes/user.routes');
const usersRoutes = require('./src/routes/users.routes');
const MongoDBConnection = require("./src/utils/common/connection");
const config = require("./src/config/config");
const path = require('path');


MongoDBConnection.getConnection((error, connection) => {
    if (error || !connection) {
        console.error('MongoDB connection failed:', error);

        // Даем время на логирование
        setTimeout(() => {
            console.error('Shutting down due to database connection failure');
            process.exit(1);
        }, 100);

        return; // Возвращаем управление для завершения setTimeout
    }
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true })); // Для form-data
    app.use(express.static(path.join(__dirname, 'public')));

    app.use("/api/users", usersRoutes);
    app.use("/api/user", userRoutes);
    // 404
    app.use(function (req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // Обработчик ошибок
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(err.status || 500).json({
            error: true,
            message: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    });
    // app.use(function (err, req, res, next) {
    //     res.status(err.statusCode || err.status || 500).send({error: true, message: err.message});
    // });

    app.listen(config.port, () =>
        console.log(`Server started on port ${config.port}`)
    );
})
