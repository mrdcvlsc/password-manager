async function actions (fastify)
{
  fastify.post('/login', (req,res)=>{
    console.log('\n\nPost request - login\n\n');
    res.send(req.body);
  });

  fastify.post('/register', (req,res)=>{
    console.log('\n\nPost request - register\n\n');
    res.send(req.body);
  });
}

module.exports = actions;