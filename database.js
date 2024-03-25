const { Pool } = require('pg');
require('dotenv').config(); 



const pool = new Pool({
    user: process.env.DB_USERPOSTGRES_USER,
    host: process.env.PGHOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.PGPORT,
    
  });

  module.exports = pool;