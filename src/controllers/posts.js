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
        return res.status(500).json({ mensagem: 'Erro inesperado do servidor' });
    }
}

const toLike = async (req, res) => {
    const { id } = req.user;
    const { postId } = req.params;

    try {
        const post = await knex('postagens').where({ id: postId }).first();

        if (!post) {
            return res.status(404).json({ mensagem: 'Postagem não encotrada' });
        }

        const alreadyLiked = await knex('postagem_curtidas').where({ usuario_id: id, postagem_id: postId }).first();

        if (alreadyLiked) {
            return res.status(400).json({ mensagem: 'O usuário já curtiu essa postagem' });
        }

        const like = await knex('postagem_curtidas').insert({
            usuario_id: id,
            postagem_id: postId
        });

        if (!like) {
            return res.status(400).json({ mensagem: 'Não foi possível curtir essa postagem' });
        }

        return res.json({ mensagem: 'Postagem curtida com sucesso' });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro inesperado do servidor' });
    }
}

const toComment = async (req, res) => {
    const { id } = req.user;
    const { postId } = req.params;
    const { texto } = req.body;

    if (!texto) {
        return res.status(400).json({ mensagem: 'Por favor insira um comentário' });
    }

    try {
        const post = await knex('postagens').where({ id: postId }).first();

        if (!post) {
            return res.status(404).json({ mensagem: 'Postagem não encotrada' });
        }

        const comment = await knex('postagem_comentarios').insert({
            usuario_id: id,
            postagem_id: postId,
            texto
        });

        if (!comment) {
            return res.status(400).json({ mensagem: 'Não foi possível comentar essa postagem' });
        }

        return res.json({ mensagem: 'Postagem comentada com sucesso' });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro inesperado do servidor' });
    }
}

const feed = async (req, res) => {
    const { id } = req.user;
    const { offset } = req.query;

    const page = offset ? offset : 0;

    try {
        const posts = await knex('postagens')
            .where('usuario_id', '!=', id)
            .limit(10)
            .offset(page);

        if (posts.length === 0) {
            return res.json(posts);
        }

        for (let post of posts) {
            // user
            const user = await knex('usuarios')
                .where({ id: post.usuario_id })
                .select('imagem', 'username', 'verificado')
                .first();
            post.user = user;

            // pictures
            const fotos = await knex('postagem_fotos')
                .where({ postagem_id: post.id })
                .select('imagem');
            post.photos = fotos;

            // likes
            const likes = await knex('postagem_curtidas')
                .where({ postagem_id: post.id })
                .select('usuario_id');
            post.likes = likes.length;

            // I liked
            post.Iliked = likes.find(like => like.usuario_id === id) ? true : false;

            // comments
            const comments = await knex('postagem_comentarios')
                .leftJoin('usuarios', 'usuarios.id', 'postagem_comentarios.usuario_id')
                .where({ postagem_id: post.id })
                .select('usuarios.username', 'postagem_comentarios.texto');
            post.comments = comments;
        }

        return res.json(posts);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro inesperado do servidor' });
    }
}

module.exports = {
    newPost,
    toLike,
    toComment,
    feed
}