const db = require('better-sqlite3')('./data.db');

try {
  db.exec(`
    create table users (
      uid TEXT PRIMARY KEY NOT NULL,
      salt TEXT NOT NULL,
      hash TEXT NOT NULL
    )`
  );
  console.log('"user" table created');
} catch (err) {
  console.log('"user" table already existing');
}

try {
  db.exec(`
    create table records (
      uid TEXT NOT NULL,
      username TEXT NOT NULL,
      platform TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);
  console.log('"records" table created');
} catch (err) {
  console.log('"records" table already existed');
}

module.exports = { db };