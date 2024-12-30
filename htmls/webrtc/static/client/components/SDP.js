import MC from './Message.js';
import { mediaDeviceStream, displayStream } from './MediaDevice.js';

// common
class Client {
	constructor() {
		this.conn = null;
		this.localStream = null;
		this.init();
	}

	getConn() {
		if (this.conn) {
			return this.conn;
		}

		try {
	        const pc = this.conn = new RTCPeerConnection(null);
	        return pc;
	    } catch (e) {
	        console.log('Failed to create PeerConnection, exception: ' + e.message);
	        alert('Cannot create RTCPeerConnection object.');
	        return;
	    }
	}

	async addLocalMediaStream() {
		const conn = this.getConn();
		const stream = await mediaDeviceStream();
		conn.addStream(stream);
		exp.call('connectLocal', { stream });
	}

	init() {	
		const conn = this.getConn();
		// 任意方负责同步 candidate
	    conn.onicecandidate = function(e) {
		    if (e.candidate) {
		        MC.send({
		            msgType: 'SYNC_CANDIDATE',
		            id: e.candidate.sdpMid,
		            label: e.candidate.sdpMLineIndex,
		            candidate: e.candidate.candidate
		        });
		        console.log('Broadcast Candidate:', e);
		    } else {
		        console.log('End of candidates.');
		    }
		};
		conn.onaddstream = event => {
	    	this.stream = event.stream;
	    	exp.on.connectRemote(event);
	    };
	    conn.onremovestream = event => {
    		if (conn) {
				conn.close();
				conn = null;			
			}
	    	exp.on.hangup(event);
	    };
		MC.on('SYNC_CANDIDATE', msg => {
		    var candidate = new RTCIceCandidate({
		        sdpMLineIndex: msg.label,
		        candidate: msg.candidate
		    });
		    this.cans = this.cans || [];

		    const conn = this.getConn();
		    // https://stackoverflow.com/questions/60387691/remote-video-not-showing-up-on-one-end-webrtc-video-chat-app
		    this.waitHandshake().then(() => {
		    	conn.addIceCandidate(candidate);
		    });
		});
	}

	waitHandshake() {
		if (this.stablePromise) {
			return this.stablePromise;
		}

		this.stablePromise = new Promise(async resolve => {
			const conn = this.getConn();
			conn.addEventListener('signalingstatechange', () => {
				const conn = this.getConn();
				if (conn.signalingState === 'stable' && conn.remoteDescription) {
					return resolve();
				}
			});
		});
		
		return this.stablePromise;
	}
}

// offer
class OfferClient {

	constructor(client) {
		this._client = client;
		this.init();
	}

	async init() {
		// step_4 receive answer
		MC.on('PUSH_ANSWER', async (msg) => {
			const conn = this._client.getConn();
		    var sdp = new RTCSessionDescription({
		        'type': 'answer',
		        'sdp': msg.sdp
		    });
		    conn.setRemoteDescription(sdp);
	    });
	}

	async start() {
		const conn = this._client.getConn();
		await this._client.addLocalMediaStream();

		try {
			// step_1
			const sessionDescription = await conn.createOffer();
			conn.setLocalDescription(sessionDescription);
			MC.send({
		        'msgType': 'PUSH_OFFER',
		        'sdp': sessionDescription.sdp
		    });
		} catch(e) {
			console.log('CreateOffer() error: ', e)
		}
	}
}

// remote
class AnswerClient {

	constructor(client) {
		this._client = client;
		this.init();
	}

	async init() {
	    // step_2 receive offer
	    MC.on('PUSH_OFFER', async (msg) => {
	    	console.log('同意连接');

	    	// 先设置本地摄像头
	    	await this._client.addLocalMediaStream();

	    	const conn = this._client.getConn();
	    	var sdp = new RTCSessionDescription({
		        'type': 'offer',
		        'sdp': msg.sdp
		    });
		    conn.setRemoteDescription(sdp);

		   	// step_3 createAnswer
		    const sessionDescription = await conn.createAnswer().catch(e => {
		    	console.log('CreateAnswer() error: ', e);
		    	return Promise.reject(e);
		    });

		    conn.setLocalDescription(sessionDescription);

		    MC.send({
		        msgType: 'PUSH_ANSWER',
		        sdp: sessionDescription.sdp
		    });
	    });
	}
}

const exp = {
	clients: (() => {
		const _client = new Client();
		return {
			_client,
			offer: new OfferClient(_client),
			remote: new AnswerClient(_client)
		}
	})(),

	on: {
		connectLocal() {},
		connectRemote() {},
		hang() {}
	},

	call(eventName, data) {
		const handler = this.on[eventName];
		if (handler) {
			const res = handler(data);
			if  (res && res.then && res.catch) {
				return res;
			}

			return Promise.resolve(res);
		}

		return Promise.resolve();
	},

	addListeners(callbacks) {
		Object.assign(this.on, callbacks);
	},

	async start() {
		exp.clients.offer.start();
	},

	getConn: () => exp.clients._client.getConn()
}

export default exp;
