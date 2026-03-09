const mysql = require('mysql2/promise');

const credentials = {
    host: 'localhost',
    user: 'root',
    password: 'Anushka@2004',
    database: 'food_rating_system'
};

const myDBConnection = async () => {
    try {
        const connection = await mysql.createConnection(credentials);
        console.log('Database connection successful');
        return connection;
    } catch (error) {
        console.error('Error creating database connection:', error);
        throw error;
    }
};

module.exports = myDBConnection;
