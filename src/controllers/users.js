const knex = require('../configs/conection');
const bcrypt = require('bcrypt');
const validateUserAndPass = require('../utils/validateUserAndPass');

const register = async (req, res) => {
    const { username, password } = req.body;

    if (!validateUserAndPass(username, password)) {
        return res.status(400).json({ mensagem: 'Todos os campos devem ser preenchidos.' });
    }

    try {
        const { count } = await knex('usuarios').where({ username }).count().first();

        if (count > 0) {
            return res.status(400).json({ mensagem: 'Já existe um usuário com o username informado.' });
        }

        const encryptedPass = await bcrypt.hash(password, 10);

        await knex('usuarios').insert({ username, senha: encryptedPass });

        return res.status(201).json({ mensagem: 'cadastro efetuado com sucesso' });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}

const getUser = async (req, res) => {
    return res.json(req.user);
}

const updateProfile = async (req, res) => {
    let {
        nome,
        imagem,
        username,
        email,
        senha,
        site,
        bio,
        telefone,
        genero
    } = req.body;

    const { id } = req.user;

    if (!nome && !imagem && !username && !email && !senha && !site && !bio && !telefone && !genero) {
        return res.status(400).json({ mensagem: 'É obrigatório informar ao menos um campo para atualização.' });
    }

    if (senha) {
        senha = await bcrypt.hash(senha, 10);
    }

    if (email !== req.user.email) {
        const checkEmail = await knex('usuarios').where({ email }).first();

        if (checkEmail) {
            return res.status(400).json({ mesangem: 'Esse email já está cadastrado, por favor utilize outro.' });
        }
    }

    if (username !== req.user.email) {
        const checkUsername = await knex('usuarios').where({ username }).first();

        if (checkUsername) {
            return res.status(400).json({ mesangem: 'Esse username já está cadastrado, por favor utilize outro.' });
        }
    }

    try {
        const updatedUser = await knex('usuarios').update({
            nome,
            imagem,
            username,
            email,
            site,
            bio,
            telefone,
            genero,
            senha
        }).where({ id });

        if (!updatedUser) {
            return res.status(400).json({ mensamge: 'O usuario não foi atualizado' });
        }

        return res.json({ mensagem: 'Os dados foram atualizados.' });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro inesperado do servidor.' });
    }
}


module.exports = {
    register,
    getUser,
    updateProfile
};