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
            // avatar: Joi.string().required()
            //     .messages({
            //         'string.base': `"Имя файла" должен быть строкой`,
            //         'string.empty': `Необходимо заполнить "Имя файла"`,
            //         'any.required': `Необходимо заполнить "Имя файла"`
            //     }),
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
            email: Joi.string().min(6).required().email()
                .messages({
                    'string.empty': `Необходимо заполнить "E-mail"`,
                    'string.email': `"E-mail" неверный`,
                    'string.min': `"E-mail" неверный`,
                    'any.required': `Необходимо заполнить "E-mail"`
                }),
            active: Joi.boolean().strict()
                .messages({
                    'string.base': `"Active" должен быть булевой значением`,
                    'string.empty': `Необходимо заполнить "Active"`,
                    'any.required': `Необходимо заполнить "Active"`
                }),
        });
        return schema.validate(data);
    }
}
module.exports = ValidationUtils;