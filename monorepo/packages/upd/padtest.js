const dgram = require('dgram');

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 26760, '10.1.1.144', (...args) => {
  client.close();
});