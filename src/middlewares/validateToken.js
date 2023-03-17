const jwt = require('jsonwebtoken');
const secret = require('../utils/secretKey');
const knex = require('../configs/conection');

const validateToken = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado' });
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = jwt.verify(token, secret);

        const checkUser = await knex('usuarios').where({ id }).first();

        if (!checkUser) {
            return res.status(404).json({ mensagem: 'Token inválido' });
        }

        const { senha, ...user } = checkUser;

        req.user = user;

        next();
    } catch (error) {
        if (error.message === 'jwt expired') {
            return res.status(403).json({ mensagem: 'Por favor realize o login' });
        }

        return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = validateToken;