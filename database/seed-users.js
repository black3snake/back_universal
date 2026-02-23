const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const Transliterate = require('../src/utils/common/transliterate');

async function seedUsers() {
    try {
        // Подключение к MongoDB
        await mongoose.connect('mongodb://localhost:27017/usersdb', {
            maxPoolSize: 10, // максимальное количество соединений в пуле
            serverSelectionTimeoutMS: 5000, // таймаут выбора сервера
            socketTimeoutMS: 45000, // таймаут сокета
            family: 4, // использовать IPv4
        });

        console.log('Подключение к БД успешно');

        // Очистка коллекции
        await User.deleteMany({});
        console.log('Коллекция users очищена');

        // Тестовые данные
        const usersData = [
            {
                firstName: "Иван",
                lastName: "Петров",
                avatar: "/uploads/users/ivan.jpg",
                experience: 5,
                age: 30,
                address: "Москва, ул. Ленина, 10",
                phone: "",
                email: "",
                active: true,
            },
            {
                firstName: "Мария",
                lastName: "Сидорова",
                avatar: "/uploads/users/maria.jpg",
                experience: 3,
                age: 28,
                address: "Санкт-Петербург, Невский пр., 25",
                phone: "",
                email: "",
                active: true,
            },
            {
                firstName: "Алексей",
                lastName: "Иванов",
                avatar: "/uploads/users/alexey.jpg",
                experience: 7,
                age: 35,
                address: "Казань, ул. Баумана, 5",
                phone: "",
                email: "",
                active: true,
            },
            {
                firstName: "Ольга",
                lastName: "Смирнова",
                avatar: "/uploads/users/olga.jpg",
                experience: 2,
                age: 25,
                address: "Екатеринбург, ул. Малышева, 45",
                phone: "",
                email: "",
                active: true,
            },
            {
                firstName: "Дмитрий",
                lastName: "Кузнецов",
                avatar: "/uploads/users/dmitry.jpg",
                experience: 10,
                age: 42,
                address: "Новосибирск, Красный проспект, 100",
                phone: "",
                email: "",
                active: true,
            }
        ];

        // Генерация URL для каждого пользователя
        const usersToInsert = usersData.map(user => {
            let fN = Transliterate.toSlug(user.firstName);
            let lN = Transliterate.toSlug(user.lastName);
            const url = fN && lN ? `${fN}_${lN}` : (fN || lN || 'user');
            return {
                ...user,
                url: url,
                createdAt: new Date()
            };
        });


        // Вставка данных
        const result = await User.insertMany(usersToInsert);

        console.log(`Добавлено ${result.length} пользователей`);
        // Проверка
        result.forEach(user => {
            console.log(`${user.firstName} ${user.lastName}: ${user.url}`);
        });

        console.log('Готово!');
        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('Ошибка:', error.message);
        process.exit(1);
    }
}


// Запуск
if (require.main === module) {
    seedUsers();
}

module.exports = seedUsers;