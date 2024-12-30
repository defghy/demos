const io = window.io;

const userId = Math.random(); // 模拟2个用户
console.log('你是：' + userId);
const platform = 'kf';
var socket = io(`${location.origin}`, {
  path: '/push',
  transports: ['websocket'],
  query: {
    userId
  }
});
// document.querySelector('#name').innerHTML = `使用用户${userId}`;

socket.on('message', function(data){
	if (handlers[data.msgType]?.length) {
		handlers[data.msgType].forEach(h => h(data));
	}
});

window.socket = socket;

const handlers = {};
const message = {
	send(message) {
		socket.emit('broadcast', {
			userId,
			...message
		});
	},
	on(type, handler) {
		if (!handlers[type]) {
			handlers[type] = [];
		}

		const curr = handlers[type];
		if (!curr.includes(handler)) {
			curr.push(handler);
		}
	}
};
window.handlers = handlers;

export default message;