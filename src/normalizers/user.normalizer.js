const BaseNormalizer = require("./base.normalizer");
const config = require("../config/config");
const fs = require('fs');
const path = require('path');

class UserNormalizer extends BaseNormalizer {
    static normalize(user) {
        if (!user) return null;

        const normalized = {
            id: this.normalizeId(user._id),
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            avatar: this.getValidAvatarUrl(user.avatar),
            avatarFile: user.avatarFile || '',
            experience: user.experience || 0,
            age: user.age || 0,
            address: user.address || '',
            phone: user.phone || '',
            email: user.email || '',
            active: user.active || false,
            createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null
        };
        normalized.url = user.url || this.generateUrlFromUser(user);
        return normalized;
    }

    static getValidAvatarUrl(avatarPath) {
        if (!avatarPath || avatarPath === 'avatar-stub.png') {
            return `${config.baseUrl}${config.defaultAvatar}`;
        }

        try {
            const rootDir = process.cwd();
            // const fullPath = path.join(__dirname, '../public', avatarPath);
            const fullPath = path.join(rootDir, 'public', avatarPath);

            if (fs.existsSync(fullPath)) {
                return `${config.baseUrl}${avatarPath}`;
            } else {
                console.warn(`Avatar file not found: ${avatarPath}`);
                return `${config.baseUrl}${config.defaultAvatar}`;
            }
        } catch (error) {
            console.error(`Error checking avatar file: ${error.message}`);
            return `${config.baseUrl}${config.defaultAvatar}`;
        }
    }

    static generateUrlFromUser(user) {
        if (user.generateUrl && typeof user.generateUrl === 'function') {
            return user.generateUrl();
        }
    }
}

module.exports = UserNormalizer;