const knex = require('../configs/conection');

const newPost = async (req, res) => {
    const { id } = req.user;
    const { texto, fotos } = req.body;

    if (!fotos || fotos.length === 0) {
        return res.status(400).json({ mensagem: 'É necessário adicionar ao menos uma foto' });
    }

    try {
        const post = await knex('postagens').insert({
            usuario_id: id,
            texto
        }).returning('*');

        if (!post) {
            return res.status(400).json({ mensagem: 'Não foi possível concluir a postagem' });
        }

        for (const foto of fotos) {
            foto.postagem_id = post[0].id;
        }

        const ImagesPost = await knex('postagem_fotos').insert(fotos);

        if (!ImagesPost) {
            await knex('postagens').where({ id: post[0].id }).del();
            return res.status(400).json({ mensagem: 'Não foi possível concluir a postagem' });
        }

        return res.json({ mensagem: 'Postagem realizada com sucesso.' });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro inesperado do servidor' });
    }
}

module.exports = {
    newPost
}