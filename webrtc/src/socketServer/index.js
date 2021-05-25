const socketio = require('socket.io');

const {
  ENV
} = process.env;

const start = function({app, server}) {

  const ws = socketio(server, {
    path: '/push',
    pingInterval: 30000
  });
  global.push = ws;

  // 设置跨域cors
  ws.origins((origin, callback) => {
    if (!origin.includes('yunshan') && !origin.includes('local')) {
      return callback('origin not allowed', false);
    }
    callback(null, true);
  });

  // 区分平台
  const plat = ws.of('/');
  plat.on('connection', (socket) => {

    const { id } = socket;
    const { userId } = socket.handshake.query;

    socket.on('broadcast', (data) => {
      const handler = handlers[data.msgType] || handlers['default'];
      handler({ socket, plat, data });
    });
    socket.on('disconnect', () => {
      if (socket.data && socket.data.roomName) {
        const currRoom = plat.adapter.rooms[socket.data.roomName];
        // 通知房间内其他用户新用户
        socket.broadcast.emit('message', {
          msgType: 'UPDATE_ROOM_USER',
          total: (currRoom && currRoom.length) || 0,
          type: 'leave',
          user: id
        });        
      }
      console.log(`WEB_SOCKET_DISCONNECT: ${userId}`);
    });
  });
};

const handlers = {
  JOIN({ socket, data, plat }) {
    const { roomName, userId } = data;
    socket.data = { roomName, userId };

    // 加入房间
    socket.join(roomName);
    const currRoom = socket.adapter.rooms[roomName];

    // 通知房间内所有用户 变动
    plat.emit('message', {
      msgType: 'UPDATE_ROOM_USER',
      total: currRoom.length,
      type: 'enter',
      user: socket.id
    });
  },
  'default'({ socket, data }) {
    socket.broadcast.emit('message', data);
  }
};

module.exports = start;
