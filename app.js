const fastify = require('fastify')({logger:true});
const fastifyStatic = require('@fastify/static');
const path = require('path');
const os = require('os');
const networkInterfaces = os.networkInterfaces();

const PORT = process.env.PORT || 8080;

// serve static front-end resources
fastify.register(fastifyStatic.default, {
  root: path.join(__dirname, 'public')
});

// routes
fastify.register(require('./routes'));

// start listening to port
const start = async () => {
  try {
    await fastify.listen(PORT, '::');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
start();

// display device's network IP
if(typeof(networkInterfaces.wlp2s0) !== 'undefined') {
  console.log(`\n(a): app-server-ip: ${networkInterfaces.wlp2s0[0].address}:${PORT}\\\n\n`);
} else if(typeof(networkInterfaces['Wi-Fi'])!=='undefined') {
  console.log(`\n(b): app-server-ip: ${networkInterfaces['Wi-Fi'][1].address}:${PORT}\\\n\n`);
} else if(typeof(networkInterfaces.Ethernet) !== 'undefined') {
  console.log(`\n(c): app-server-ip: ${networkInterfaces.Ethernet[1].address}:${PORT}\\\n\n`);
} else {
  console.log('\nno IP found for sharing over the network\n\n');
}