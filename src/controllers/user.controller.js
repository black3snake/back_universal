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


            const users = await UserModel.find()
                .sort({createdAt: -1})
                .skip(skip)
                .limit(itemsPerPage);

            const total = await UserModel.countDocuments();

            const normalized = UserNormalizer.normalizeList(users);
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
            res.status(500).json({error: error.message});
        }
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

    // async getOne(req, res) {
    //     try {
    //         const user = await UserModel.findById(req.params.id);
    //         if (!user) return res.status(404).json({ error: 'Not found' });
    //
    //         const normalized = UserNormalizer.normalize(user);
    //         res.json(normalized);
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // }

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

                if (req.file) {
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
            const user = await UserModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!user) return res.status(404).json({error: 'Not found'});

            const normalized = UserNormalizer.normalize(user);
            res.json(normalized);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async delete(req, res) {
        try {
            const user = await UserModel.findByIdAndDelete(req.params.id);
            if (!user) return res.status(404).json({error: 'Not found'});
            res.json({success: true});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async uploadAvatar(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({error: 'Файл не загружен'});
            }

            const user = await UserModel.findOne({url: req.params.url});
            if (!user) return res.status(404).json({error: 'Пользователь не найден'});

            // Удаляем старый файл, если он существует
            if (user.avatar) {
                const oldFilePath = path.join(__dirname, '../public', user.avatar);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            // Сохраняем путь относительно public директории
            const relativePath = `/uploads/${req.file.filename}`;
            user.avatar = relativePath;
            await user.save();

            const normalized = UserNormalizer.normalize(user);
            res.json({
                message: 'Аватар успешно загружен',
                user: normalized
            });
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
}

module.exports = new UserController();