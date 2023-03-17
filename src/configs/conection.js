const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'Ace2707093096',
        database: 'mini_insta'
    }
});

module.exports = knex;