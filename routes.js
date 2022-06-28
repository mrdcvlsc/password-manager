async function routes (fastify)
{
  fastify.get('/login', (req,res) => {
    res.sendFile('html/login.html');
  });

  fastify.get('/register', (req,res) => {
    res.sendFile('html/register.html');
  });

  fastify.get('/view', (req,res) => {
    res.sendFile('html/password-view.html');
  });

  fastify.setNotFoundHandler((req, res) => {
    res.code(404).send('404 - Not Found');
  });
}

module.exports = routes;