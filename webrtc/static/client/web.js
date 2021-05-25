import sdp from './components/SDP.js';
import MC from './components/Message.js';
import { displayStream } from './components/MediaDevice.js';

const dqs = document.querySelector.bind(document);
(function init() {
	MC.on('UPDATE_ROOM_USER', async (msg) => {
	    demoAPI.userNum = msg.total;
	    document.querySelector('.roomUserNum').innerText = `当前用户数: ${msg.total}`;
	});

	sdp.addListeners({
		connectLocal({ stream }) {
			const videoEl = dqs(".local");
			videoEl.srcObject = stream; 
		    videoEl.play();  // 播放
		},
		connectRemote({ stream }) {
			const videoEl = dqs(".remote");
			videoEl.srcObject = stream;
			videoEl.play(); // 播放 
		},
		hangup(event) {
			const videoEl = dqs(".remote");
			videoEl.stop();
			videoEl.srcObject = null;
		}
	});
})();

const demoAPI = {
	userNum: 1,
	// 开始sdp协议传输视频音频
	async startSDP() {
		if (this.userNum <= 1) {
			return alert('用户个数小于1，无法发起');
		}

		sdp.start();
	},
	async shareDesktop() {
		const video = dqs(".remote");
		const conn = sdp.getConn();
		const stream = await displayStream();

		try {
			video.srcObject = stream;
			video.play();

			var videoTrack = stream.getVideoTracks()[0];
			var sender = conn.getSenders().find(function(s) {   
			return s.track.kind == videoTrack.kind;
			}); 
			console.log('found sender:', sender);
			sender.replaceTrack(videoTrack);
		} catch(e) {
			console.error(err);
		}
	},
	// 进入房间
	joinRoom({ roomNo }) {
		console.log(`加入房间：${roomNo}`);
		MC.send({
		    msgType: 'JOIN',
		    roomName: roomNo
		});
	}
};

export default demoAPI;
