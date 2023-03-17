const knex = require('../configs/conection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('../utils/secretKey');
const validateUserAndPass = require('../utils/validateUserAndPass');

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!validateUserAndPass(username, password)) {
        return res.status(400).json({ mensagem: 'Todos os campos devem ser preenchidos.' });
    }

    try {
        const user = await knex('usuarios').where({ username }).first();

        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        const pass = await bcrypt.compare(password, user.senha);

        if (!pass) {
            return res.status(400).json({ mensagem: 'Username ou senha incorreta.' });
        }

        const token = jwt.sign({
            id: user.id,
            username: user.username
        }, secret, { expiresIn: '5h' });

        const { senha: _, ...userData } = user;

        return res.json({
            usuario: userData,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}

module.exports = login;