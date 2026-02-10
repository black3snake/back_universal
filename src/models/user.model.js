const mongoose = require('mongoose');
const Transliterate = require("../utils/common/transliterate");

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    avatar: String,
    experience: Number,
    age: Number,
    address: String,
    phone: String,
    email: String,
    active: Boolean,
    url: {
      type: String,
      unique: true,
      index: true
    },
    createdAt: { type: Date, default: Date.now }
});

// Опционально: виртуальное поле для автоматической генерации URL
UserSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Метод для генерации URL
UserSchema.methods.generateUrl = function() {
    const fN = Transliterate.toSlug(this.firstName);
    const lN = Transliterate.toSlug(this.lastName);
    return fN && lN ? `${fN}_${lN}` : (fN || lN || 'user');
};

// Предварительная обработка перед сохранением
UserSchema.pre('save', function(next) {
    // Автоматически генерируем URL, если он не задан
    if (!this.url) {
        this.url = this.generateUrl();
    }
    next();
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;

