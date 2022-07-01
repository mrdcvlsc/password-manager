// import database handler functions
const Handler = require('./handler');

const PMUsers = {
  type: 'object',
  properties: {
    uid  : { type : 'string' },
    psw1 : { type : 'string' },
    psw2 : { type : 'string' }
  }
}

const Records = {
  type: 'object',
  properties: {
    username : { type : 'string' },
    platform : { type : 'string' },
    password : { type : 'string' }
  }
}

const Option = {

  AddUser: {
    schema: {
      body: {
        type: 'object',
        required: ['uid', 'psw1', 'psw2'],
        properties: PMUsers.properties
      },
      response: {
        201: {
          type: 'object',
          properties: {
            changes: { type: 'number' }
          }
        }
      }
    },
    handler: Handler.AddUser
  },

  LoginUser: {
    schema: {
      body: {
        type: 'object',
        required: ['uid', 'psw'],
        properties: {
          uid: { type : 'string' },
          psw: { type : 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            results: { type: 'number' }
          }
        }
      }
    },
    handler: Handler.LoginUser
  },

  ViewRecords: {
    schema: {
      response: {
        200: {
          type: 'array',
          items: Records
        }
      }
    },
    handler: Handler.ViewRecords
  },

  AddRecord: {
    schema: {
      body: {
        type: 'object',
        required: ['platform', 'username', 'pass1', 'pass2'],
        properties: {
          platform: { type : 'string' },
          username: { type : 'string' },
          pass1: { type : 'string' },
          pass2: { type : 'string' },
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            changes: { type: 'number' }
          }
        }
      }
    },
    handler: Handler.AddRecord
  }
}

async function actions (fastify)
{
  // password-manager user actions
  fastify.post('/login', Option.LoginUser);
  fastify.post('/register', Option.AddUser);
  fastify.post('/logout', async (req,res) => {
    try {
      await req.session.destroy();
      return true;
    } catch(err) {
      console.error('Logout failed:\n');
      console.error(err);
      return false;
    }
  });

  // user record actions
  fastify.get('/records', Option.ViewRecords);
  fastify.post('/records/add', Option.AddRecord);
  // fastify.post('/records/remove', Option.RemoveRecords);
}

module.exports = actions;