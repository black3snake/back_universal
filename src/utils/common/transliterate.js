class Transliterate {
    static cyrToLat(text) {
        if (!text) return '';

        const map = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e',
            'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k',
            'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
            'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
            'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
            'э': 'e', 'ю': 'yu', 'я': 'ya',
            ' ': '_', '_': '_', '-': '_'
        };

        return text.toLowerCase().split('').map(char => {
            // Если символ есть в мапе, используем его
            if (map[char]) return map[char];
            // Если это латинская буква или цифра, оставляем как есть
            if (/[a-z0-9]/.test(char)) return char;
            // Все остальное заменяем на пустую строку
            return '';
        }).join('');
    }

    static toSlug(text) {
        const slug = this.cyrToLat(text);
        // Удаляем повторяющиеся подчеркивания
        return slug.replace(/_+/g, '_').replace(/^_|_$/g, '');
    }
}
module.exports = Transliterate;