#Универсальный бэкенд

1. npm i
2. загрузить в БД начальную информацию npm run seed
3. чуть позже добавлю более полную инфу по таблицам и маршрутам

Таблица Users
```
{
"data": [
    {
        "id": "69844de5da7d7e0fd9a54210",
        "firstName": "Иван",
        "lastName": "Петров",
        "avatar": "http://localhost:4000/uploads/users/ivan.jpg",
        "experience": 5,
        "age": 30,
        "address": "Москва, ул. Ленина, 10",
        "phone": "",
        "email": "",
        "active": true,
        "createdAt": "2026-02-05T07:59:33.232Z",
        "url": "ivan_petrov"
    },
],
"pagination": {
        "page": 1,
        "itemsPerPage": 10,
        "total": 5,
        "totalPages": 1
}}
```