const bcrypt = require('bcrypt');

module.exports = {
    async hashPassword(doc) {
        if (doc.password) {
            doc.password = await bcrypt.hash(doc.password, 10);
        }
    }
};