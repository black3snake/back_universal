const Joi = require("@hapi/joi");

class ValidationUtils {
    static createOrderValidation(data) {
        const schema = Joi.object({
            firstName: Joi.string().required()
                .messages({
                    'string.empty': `Необходимо заполнить "Имя"`,
                    'any.required': `Необходимо заполнить "Имя"`
                }),
            lastName: Joi.string().required()
                .messages({
                    'string.empty': `Необходимо заполнить "Фамилия"`,
                    'any.required': `Необходимо заполнить "Фамилия"`
                }),
            avatar: Joi.string().required()
                .messages({
                    'string.base': `"Имя файла" должен быть строкой`,
                    'string.empty': `Необходимо заполнить "Имя файла"`,
                    'any.required': `Необходимо заполнить "Имя файла"`
                }),
            experience: Joi.number().max(50).required()
                .messages({
                    'string.base': `"Опыт" должен быть строкой`,
                    'string.empty': `Необходимо заполнить "Опыт"`,
                    'string.max': `Неверный "Опыт"`,
                    'any.required': `Необходимо заполнить "Опыт"`
                }),
            age: Joi.number().max(100).required()
                .messages({
                    'string.base': `"Возраст" должен быть строкой`,
                    'string.empty': `Необходимо заполнить "Возраст"`,
                    'string.max': `Неверный "Возраст"`,
                    'any.required': `Необходимо заполнить "Возраст"`
                }),
            address: Joi.string().max(400).required()
                .messages({
                    'string.base': `"Адрес" должен быть строкой`,
                    'string.empty': `Необходимо заполнить "Адрес"`,
                    'string.max': `Неверный "Адрес"`,
                    'any.required': `Необходимо заполнить "Адрес"`
                }),
            phone: Joi.string().required()
                .messages({
                    'string.base': `"Телефон" должен быть строкой`,
                    'string.empty': `Необходимо заполнить "Телефон"`,
                    'any.required': `Необходимо заполнить "Телефон"`
                }),
            email: Joi.string().trim().min(6).required().email()
                .messages({
                    'string.empty': `Необходимо заполнить "E-mail"`,
                    'string.email': `"E-mail" неверный`,
                    'string.min': `"E-mail" неверный`,
                    'any.required': `Необходимо заполнить "E-mail"`
                }),
            active: Joi.boolean().strict()
                .default(false)
                .messages({
                    'boolean.base': `"Active" должен быть булевой значением`,
                    'boolean.empty': `Необходимо заполнить "Active"`,
                    'any.required': `Необходимо заполнить "Active"`
                }),
            reserved: Joi.boolean().strict()
                .default(false) // Если не передано, будет false
                .messages({
                    'boolean.base': 'Поле "reserved" должно быть true или false'
                })

        });
        return schema.validate(data, {abortEarly: false});
    }

    // Схема для обновления (все поля опциональны)
    static updateOrderValidation(data) {
        const schema = Joi.object({
            firstName: Joi.string()
                .messages({
                    'string.empty': `Необходимо заполнить "Имя"`
                }),
            lastName: Joi.string()
                .messages({
                    'string.empty': `Необходимо заполнить "Фамилия"`
                }),
            avatar: Joi.string()
                .messages({
                    'string.base': `"Имя файла" должен быть строкой`,
                    'string.empty': `Необходимо заполнить "Имя файла"`
                }),
            experience: Joi.number().max(50)
                .messages({
                    'number.base': `"Опыт" должен быть числом`,
                    'number.max': `Максимальный опыт 50 лет`
                }),
            age: Joi.number().max(100)
                .messages({
                    'number.base': `"Возраст" должен быть числом`,
                    'number.max': `Максимальный возраст 100 лет`
                }),
            address: Joi.string().max(400)
                .messages({
                    'string.base': `"Адрес" должен быть строкой`,
                    'string.empty': `Необходимо заполнить "Адрес"`,
                    'string.max': `Адрес не может быть длиннее 400 символов`
                }),
            phone: Joi.string()
                .messages({
                    'string.base': `"Телефон" должен быть строкой`,
                    'string.empty': `Необходимо заполнить "Телефон"`
                }),
            email: Joi.string().trim().min(6).email()
                .messages({
                    'string.empty': `Необходимо заполнить "E-mail"`,
                    'string.email': `"E-mail" неверный`,
                    'string.min': `"E-mail" должен содержать минимум 6 символов`
                }),
            active: Joi.boolean().strict()
                .messages({
                    'boolean.base': `"Active" должен быть булевым значением`
                }),
            reserved: Joi.boolean().strict()
                .messages({
                    'boolean.base': 'Поле "reserved" должно быть true или false'
                })
        }).min(1); // Хотя бы одно поле должно быть для обновления

        return schema.validate(data, { abortEarly: false });
    }

}
module.exports = ValidationUtils;