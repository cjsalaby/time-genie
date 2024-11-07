const authService = require('../../services/auth-service');

const login = async (req, res, next) => {
    try {
        const credentials = req.body;
        const response = await authService.login(credentials);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const updatePassword = async (req, res, next) => {
    try {
        const user = req.user;
        const credentials = req.body;
        const response = await authService.updatePassword(user, credentials);

        return res.status(200).json(response);

    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

module.exports = {
    login,
    updatePassword,
}