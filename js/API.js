import debug from './debug.js';
import settings from './settings.js';

class API {
	constructor(server) {
		debug.log('API: Created for: ' + server);
		this.server = server;
	}

	callCallback(appData, url, callback) {
		debug.log('API: Calling: "' + url + '" on ' + this.server);
		const API = new XMLHttpRequest();
		url = url.replace(this.server, ''); // Git gives full urls, so strip the server from the url
		API.open('GET', this.server + url + '?access_token=' + settings.tokens.git);
		API.setRequestHeader('Content-Type', 'application/json');
		API.onload = function() {
			appData.apiCalls++;
			if (API.status === 200) {
				return callback(JSON.parse(API.responseText));
			} else {
				console.warn('We didn\'t receive 200 status');
			}
		};
		API.send();
	}

	// Yes this function is mainly repeating the above, I will ultimately choose the method that suits me best
	callPromise(appData, url) {
		const promise = new Promise((resolve, reject) => {
			const API = new XMLHttpRequest();
			url = url.replace(this.server, ''); // Git gives full urls, so strip the server from the url
			API.open('GET', this.server + url + '?access_token=' + settings.tokens.git + '&per_page=100');
			API.setRequestHeader('Content-Type', 'application/json');
			API.onload = function() {
				appData.apiCalls++;
				if (API.status === 200) {
					resolve(JSON.parse(API.responseText));
				} else {
					reject('We didn\'t receive 200 status');
				}
			};
			API.send();
		});
		return promise;
	}
}

export default API;