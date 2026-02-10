const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Создаем директорию для загрузок, если ее нет
const rootDir = process.cwd();
const uploadDir = path.join(rootDir, 'public', 'uploads', 'users');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Конфигурация хранилища
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Генерируем уникальное имя файла
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Фильтр файлов
const fileFilter = (req, file, cb) => {
    // Разрешаем только определенные типы файлов
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Недопустимый тип файла'));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 // 1MB. Если надо больше, то fileSize: 2 * 1024 * 1024 (2Мб)
    },
    fileFilter: fileFilter
});

module.exports = upload;