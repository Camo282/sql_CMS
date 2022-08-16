const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'Dutchman18!',
      database: 'cms'
    },
    console.log('Connected to the CMS database.')
  );

  module.exports = db;