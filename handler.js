const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// initialize database and it's tables
const { db } = require('./database');

// initialize database statements
const PrepStatement = new (require('./statements'))(db);

function ErrorHandler(err, sqlCommand) {
  console.error(
    `\nERROR : [${sqlCommand}]
      message : ${err.message},
      code    : ${err.code}\n`
  );
}

const Handler = {
  AddUser : async function(req,res) {
    let { uid, psw1, psw2 } = req.body;

    if(psw1!==psw2) {
      return 'Password did not match';
    } else if(psw1.length < 8) {
      return 'Password too short';
    } else {
      try {
        // password hasing
        let salt = await bcrypt.genSalt(SALT_ROUNDS);
        let hash = await bcrypt.hash(psw1,salt);

        // store in database
        let result = PrepStatement.AddUser.run(uid,salt,hash);
        return result;
      } catch (err) {
        if(err.code==='SQLITE_CONSTRAINT_PRIMARYKEY') {
          return 'Username already existed';
        }
        return 'Opps! Something Went Wrong';
      }
    }
  },

  LoginUser: async function(req,res) {
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
      let Authentic = await bcrypt.compare(psw,result[0].hash);

      if(!Authentic) {
        return 'Incorrect Password';
      }

      return 'Login Success';
      
    } catch (err) {
      console.error(err);
      return 'Opps! something went wrong...';
    }
  }
}

module.exports = Handler;