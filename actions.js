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
  }
}

async function actions (fastify)
{
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
}

module.exports = actions;