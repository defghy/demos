require('dotenv').config({ path: 'config/.env' });
const { app, server } = require('./server');
require('./socketServer')({ app, server });

const { PORT } = process.env;
server.listen(PORT);
server.on('listening', () => {
  console.log(`服务启动，listening: ${PORT}`);
})
