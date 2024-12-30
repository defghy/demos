let cameraStream = null;
async function mediaDeviceStream() {
	if (cameraStream) {
		return cameraStream;
	}
	if (!navigator.mediaDevices) {
		alert(`不支持摄像头，请检查域名，协议，浏览器`);
		return Promise.reject(new Error(`不支持摄像头，请检查域名，协议，浏览器`));
	}

	try {
		const stream = cameraStream = await navigator.mediaDevices.getUserMedia({
		  audio: false, video: true
		});

		return stream;		
	} catch(e) {
		console.log("navigator.getUserMedia error: ", e); 
	}
}

async function displayStream() {
	if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
		alert(`不支持共享桌面`);
		return Promise.reject(new Error(`不支持共享桌面`));
	}

	try {
		const stream = await navigator.mediaDevices.getDisplayMedia({
		  video: true,
		  audio: false
		});

		return stream;		
	} catch(e) {
		console.log("navigator.getDisplayMedia error: ", e); 
	}
}

export {
	mediaDeviceStream,
	displayStream
};