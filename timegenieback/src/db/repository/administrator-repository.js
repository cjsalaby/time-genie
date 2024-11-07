const Administrator = require('../../models/administrator');

const getAdmin = async (admin) => {
    return await Administrator.findOne({
        where: {
            username: admin,
        }
    });
}

module.exports = {
    getAdmin,
}