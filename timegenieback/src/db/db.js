require('dotenv/config');
const Sequelize = require('sequelize');


const SQLUSER = process.env.SQLUSER;
const SQLHOST = process.env.SQLHOST;
const SQLDATABASE = process.env.SQLDATABASE;
const SQLPASSWORD = process.env.SQLPASSWORD;
const SQLPORT = process.env.SQLPORT;


const sequelize = new Sequelize(SQLDATABASE, SQLUSER, SQLPASSWORD, {
    host: SQLHOST,
    port: SQLPORT,
    dialect: 'postgres',
    timezone: '0:00',
})

sequelize.sync();

sequelize.authenticate().then(() => {
    console.log("SUCCESS: Connected to database: " + SQLDATABASE);
}).catch((err) => {
    console.log("Error connecting to the database.", err);
})

// Export object
module.exports = sequelize;
