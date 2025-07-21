const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports = {
    async hashPassword(doc) {
        if (doc.password) {
            const salt = await bcrypt.genSalt(10);
            doc.password = await bcrypt.hash(doc.password, salt);
        }
    },

    async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    },

    async generateApiToken(doc) {
        doc.apiToken = crypto.randomBytes(32).toString('hex');
    }
};