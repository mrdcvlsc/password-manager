const Password = require('./crypto-scheme');

// initialize database and it's tables
const { db } = require('./database');

// initialize database statements
const PrepStatement = new (require('./statements'))(db);

const Handler = {

  // <-- todo +++ : add session logic here, deny post request if user is still logged in

  AddUser : async function(req,res) {
    let { uid, psw1, psw2 } = req.body;

    if(psw1!==psw2) {
      return 'Password did not match';
    } else if(psw1.length < 8) {
      return 'Password too short';
    } else {
      try {
        // password hasing
        let { salt, hash } = await Password.Hash(psw1);

        // store in database
        let result = PrepStatement.AddUser.run(uid,salt,hash);
        return 'Account Created, Login to continue';
      } catch (err) {
        if(err.code==='SQLITE_CONSTRAINT_PRIMARYKEY') {
          return 'Username already existed';
        }
        return 'Opps! Something Went Wrong';
      }
    }
  },

  LoginUser: async function(req,res) {

    // <-- todo +++ : add session logic here, deny post request if user is still logged in

    let { uid, psw } = req.body;
    try {
      // Check is user exist
      let result = [];
      for(let row of PrepStatement.LoginUser.iterate(uid)){
        result.push(row);
      }

      if(result.length !== 1) {
        return 'User does not exist';
      }

      // Authenticate
      let Authentic = await Password.Compare(psw,result[0].hash);

      if(!Authentic) {
        return 'Incorrect Password';
      }
      
      // record user session
      req.session.user = uid;
      req.session.ukey = Password.GenKey(psw);

      // bring to view
      res.redirect('/view');
      
    } catch (err) {
      console.error(err);
      return 'Opps! something went wrong...';
    }
  },

  ViewRecords: async function(req,res) {
    if(req.session.user) {
      let uid = req.session.user;

      // get records for specific user
      let result = [];
      for(let row of PrepStatement.ReadRecord.iterate(uid)) {
        row.password = Password.Decrypt(req.session.ukey,row.password);
        result.push(row);
      }

      return result;
    } else {
      return 'You Are not logged in';
    }
  },

  AddRecord: async function(req,res) {
    if(req.session.user) {
      let uid = req.session.user;

      let {username, platform, pass1, pass2} = req.body;

      // check password if equal
      if(pass1 !== pass2) {
        return 'Opps, Password did not match!';
      }

      // check if record already exist
      let results = [];
      for(let row of PrepStatement.CheckRecord.iterate(uid,username,platform)){
        results.push(row);
      }

      if(results.length!==0) {
        return 'Record already existed';
      }

      // add record
      let EncryptedPassword = Password.Encrypt(req.session.ukey,pass1);
      PrepStatement.AddRecord.run(uid,username,platform,EncryptedPassword);

      // bring to view
      res.redirect('/view');
    } else {
      return 'Opps, Something went wrong';
    }
  }
}

module.exports = Handler;