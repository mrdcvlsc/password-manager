/* ukey = uid + username + platform */

class Statement {
  constructor(db) {
    try {
      this.AddUser = db.prepare('INSERT INTO users (uid, sign) VALUES (?, ?)');
      this.DeleteUser = db.prepare('DELETE FROM users WHERE uid = ?');

      this.AddRecord = db.prepare('INSERT INTO records (ukey, uid, username, platform, password) VALUES (?, ?, ?, ?, ?)');
      this.EditRecord = db.prepare('UPDATE records SET ukey = ?, uid = ?, username = ?, platform = ?, password = ? WHERE ukey = ?');
      this.ReadRecord = db.prepare('SELECT username, platform, password FROM records WHERE uid = ?');
      this.DeleteRecord = db.prepare('DELETE FROM records WHERE ukey = ?');
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}

module.exports = Statement;