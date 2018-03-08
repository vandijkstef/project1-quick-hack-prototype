// import debug from './debug.js';
// import settings from './settings.js';

class API {
	constructor(server) {
		this.server = server;
	}

	callCallback(url, callback) {
		const API = new XMLHttpRequest();
		url = url.replace(this.server, ''); // Git gives full urls, so strip the server from the url
		API.open('GET', this.server + url);
		API.onload = function() {
			if (API.status === 200) {
				return callback(JSON.parse(API.responseText));
			} else {
				console.warn('We didn\'t receive 200 status');
			}
		};
		API.send();
	}
	
}

export default API;