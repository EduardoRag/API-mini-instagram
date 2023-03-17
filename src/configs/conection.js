const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: '',
        database: 'mini_insta'
    }
});

module.exports = knex;