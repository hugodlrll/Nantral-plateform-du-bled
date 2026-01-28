const { Pool } = require("pg");

const pool = new Pool({
    host:"localhost",
    port:5432,
    user:"postgres",
    password:"(Gogo49)330!",
    database:"nantralptf"
});

module.exports = pool;