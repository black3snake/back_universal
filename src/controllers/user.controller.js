const UserModel = require('../models/user.model');
const UserNormalizer = require('../normalizers/user.normalizer');

class UserController {
    async getUsers(req, res) {
        try {
            const itemsPerPage = 10;
            const page = Math.max(1, parseInt(req.query.page, 10) || 1);
            const skip = (page - 1) * itemsPerPage;


            const users = await UserModel.find()
                .sort({ createdAt: -1 })
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
            res.status(500).json({ error: error.message });
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
        try {
            const user = new UserModel(req.body);
            await user.save();

            const normalized = UserNormalizer.normalize(user);
            res.status(201).json(normalized);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const user = await UserModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            if (!user) return res.status(404).json({ error: 'Not found' });

            const normalized = UserNormalizer.normalize(user);
            res.json(normalized);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const user = await UserModel.findByIdAndDelete(req.params.id);
            if (!user) return res.status(404).json({ error: 'Not found' });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async uploadAvatar(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Файл не загружен' });
            }

            const user = await UserModel.findById(req.params.id);
            if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

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
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new UserController();