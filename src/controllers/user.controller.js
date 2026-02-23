const UserModel = require('../models/user.model');
const UserNormalizer = require('../normalizers/user.normalizer');
const ValidationUtils = require("../utils/validation.utils");
const path = require("path");
const fs = require('fs');

class UserController {
    async getUsers(req, res) {
        try {
            const itemsPerPage = 10;
            const page = Math.max(1, parseInt(req.query.page, 10) || 1);
            const skip = (page - 1) * itemsPerPage;
            let total = {};
            let users = {};
            let normalized = {};
            // for search
            const {query} = req.query;
            if (query) {
                const searchCondition = {
                    $or: [
                        {firstName: {$regex: query, $options: 'i'}},
                        {lastName: {$regex: query, $options: 'i'}}
                    ]
                };

                total = await UserModel.countDocuments(searchCondition);

                users = await UserModel
                    .find(searchCondition)
                    .skip(skip)
                    .limit(itemsPerPage)
                    .lean();

                normalized = users.map(item => UserNormalizer.normalize(item));

            } else {

                users = await UserModel.find()
                    .sort({createdAt: -1})
                    .skip(skip)
                    .limit(itemsPerPage);

                total = await UserModel.countDocuments();
                normalized = UserNormalizer.normalizeList(users);
            }

            res.json({
                data: normalized,
                pagination: {
                    page,
                    itemsPerPage,
                    total,
                    totalPages: Math.ceil(total / itemsPerPage),
                }
            });

        } catch (error) {
            res.status(500).json({
                    error: true,
                    message: error.message
                }
            );
        }
    }

    async searchUsers(req, res) {
        const itemsPerPage = 10;
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const skip = (page - 1) * itemsPerPage;
        const {query} = req.query;
        if (!query) {
            return res.status(400)
                .json({error: true, message: "Не передан параметр query"});
        }

        const searchCondition = {
            $or: [
                {firstName: {$regex: query, $options: 'i'}},
                {lastName: {$regex: query, $options: 'i'}}
            ]
        };

        const total = await UserModel.countDocuments(searchCondition);

        let users = await UserModel
            .find(searchCondition)
            .skip(skip)
            .limit(itemsPerPage)
            .lean();

        users = users.map(item => UserNormalizer.normalize(item));

        res.json({
            data: users,
            pagination: {
                page,
                itemsPerPage,
                total,
                totalPages: Math.ceil(total / itemsPerPage),
            }
        });

    }

    async getUser(req, res) {
        try {
            const {url} = req.params;
            if (!url) {
                return res.status(400).json({
                    error: true,
                    message: 'URL not found'
                });
            }
            let user = await UserModel.findOne({url: url});
            if (!user) {
                return res.status(404).json({
                    error: true,
                    message: 'User not found'
                });
            }
            res.json(UserNormalizer.normalize(user));
        } catch (error) {
            res.status(500).json({
                error: true,
                message: error.message
            });
        }
    }

    async create(req, res) {
        console.log('Данные запроса:', req.body);
        console.log('Файл:', req.file);

        // Проверяем наличие файла
        if (!req.file) {
            // Если файла нет, можно использовать заглушку или вернуть ошибку
            // В зависимости от требований
            console.log('Файл не загружен, используем заглушку');
        }


        const {error} = ValidationUtils.createOrderValidation(req.body);
        if (error) {
            console.log(error.details);
            return res.status(400).json({error: true, message: error.details[0].message});
        }
        try {
            // Создаем пользователя из данных формы
            const user = new UserModel({
                ...req.body,
                // Если есть файл, добавляем путь к аватару
                avatar: req.file ? `/uploads/users/${req.file.filename}` : '/images/avatar-stub.png'
            });

            // const user = new UserModel(req.body);
            const existingUser = await UserModel.findOne({url: user.generateUrl()});
            if (existingUser) {

                if (req.file && !req.file.includes('stub')) {
                    const rootDir = process.cwd();
                    const filePath = path.join(rootDir, 'public', 'uploads', req.file.filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
                return res.status(400).json({error: true, message: 'Такой пользователь уже существует'});
            }

            // Удаляем старый файл, если есть (для обновления)
            if (user.avatar && user.avatar !== '/images/avatar-stub.png') {
                const rootDir = process.cwd();
                const oldFilePath = path.join(rootDir, 'public', user.avatar.replace(/^.*\//, ''));
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }


            await user.save();

            const normalized = UserNormalizer.normalize(user);
            res.status(201).json(normalized);
        } catch (error) {
            if (req.file) {
                const rootDir = process.cwd();
                const filePath = path.join(rootDir, 'public', 'uploads', req.file.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            res.status(500).json({error: true, message: error.message});
        }
    }

    async update(req, res) {
        try {
            const {url} = req.params;

            if (!url) {
                return res.status(400).json({
                    error: true,
                    message: 'URL parameter is required'
                });
            }
            const existingUser = await UserModel.findOne({url});
            if (!existingUser) {
                return res.status(404).json({
                    error: true,
                    message: 'User not found'
                });
            }

            // Подготавливаем данные для обновления
            const updateData = {...req.body};

            // Обработка файла аватара (если загружен новый)
            if (req.file) {
                // Сохраняем новый аватар
                const avatarUrl = `/uploads/users/${req.file.filename}`;
                updateData.avatar = avatarUrl;

                // Удаляем старый аватар, если он есть
                if (existingUser.avatar && !existingUser.avatar.includes('avatar-stub.png')) {
                    const oldAvatarPath = path.join(
                        process.cwd(),
                        'public',
                        existingUser.avatar
                    );

                    try {
                        if (fs.existsSync(oldAvatarPath)) {
                            fs.unlinkSync(oldAvatarPath);
                            console.log('Старый аватар удален:', oldAvatarPath);
                        }
                    } catch (err) {
                        console.error('Ошибка при удалении старого аватара:', err);
                    }
                }
            }
            // Если нужно удалить аватар (пришел avatar: null)
            if (req.body.avatar === 'null' || req.body.avatar === '') {
                // Удаляем файл старого аватара
                if (existingUser.avatar && !existingUser.avatar.includes('avatar-stub.png')) {
                    const oldAvatarPath = path.join(
                        process.cwd(),
                        'public',
                        existingUser.avatar
                    );
                    try {
                        if (fs.existsSync(oldAvatarPath)) {
                            fs.unlinkSync(oldAvatarPath);
                        }
                    } catch (err) {
                        console.error('Ошибка при удалении аватара:', err);
                    }
                }
                updateData.avatar = null;
            }
            // Обновляем пользователя
            const updatedUser = await UserModel.findOneAndUpdate(
                {url},
                {$set: updateData},
                {
                    new: true,        // возвращаем обновленный документ
                    runValidators: true // запускаем валидацию схемы
                }
            );

            const normalized = UserNormalizer.normalize(updatedUser);
            res.json(normalized);

        } catch (error) {
            res.status(500).json({error: true, message: error.message});
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;

            if (!id) {
                return res.status(400).json({
                    error: true,
                    message: 'ID parameter is required'
                });
            }

            const user = await UserModel.findById(id);
            if (!user) {
                return res.status(404).json({
                    error: true,
                    message: 'User not found'
                })
            }

            if (user.avatar) {
                const avatarPath = path.join(process.cwd(), 'public', user.avatar);
                try {
                    if (fs.existsSync(avatarPath)) {
                        fs.unlinkSync(avatarPath);
                    }
                } catch (err) {
                    console.error('Ошибка при удалении аватара:', err.message);
                }

            }
            await UserModel.findByIdAndDelete(req.params.id);

            res.json({
                error: false,
                message: 'User deleted successfully'
            });


        } catch (error) {
            res.status(500).json({
                error: true,
                message: error.message
            });
        }
    }

}

module.exports = new UserController();