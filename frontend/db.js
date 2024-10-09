const mysql = require('mysql');

const userDb = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Zxasqw7566!',
  database: 'userdb'
});

const unDb = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Zxasqw7566!',
  database: 'undb'
});

userDb.connect(err => {
  if (err) {
    console.error('Error connecting to userDb:', err);
    throw err;
  }
  console.log('userDb connected...');
});

unDb.connect(err => {
  if (err) {
    console.error('Error connecting to unDb:', err);
    throw err;
  }
  console.log('unDb connected...');
});

module.exports = { userDb, unDb };