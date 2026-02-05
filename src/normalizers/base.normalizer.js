class BaseNormalizer {
    static normalize(data) {
        throw new Error('Method normalize() must be implemented in child class');
    }

    static normalizeList(items) {
        if (!Array.isArray(items)) return [];
        return items.map(item => this.normalize(item));
    }

    static normalizeId(_id) {
        return _id ? _id.toString() : null;
    }
}

module.exports = BaseNormalizer;
