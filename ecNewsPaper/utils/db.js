<<<<<<< HEAD
import knexObj from 'knex';

const knex = knexObj({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'ecnewspaper'
  },
  pool: { min: 0, max: 7 }
});

export default knex;
=======
import knexObj from "knex";

const knex = knexObj({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "ectable",
  },
  pool: { min: 0, max: 7 },
});

export default knex;
>>>>>>> d81256e34f2c58bbf84262f547b0e71354aacebf
