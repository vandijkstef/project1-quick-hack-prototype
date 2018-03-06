// import API from './API.js';
// import Repo from './Repo.js';

class SPARQL {
	// Just for sake of lolz
	constructor() {
		this.server = 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=';
		this.postQuery = '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
	}

	Fetch(query, callback) {
		const queryEnc = encodeURIComponent(query);
		const queryUrl = this.server + queryEnc + this.postQuery;
		fetch(queryUrl)
			.then((res) => res.json())
			.then(function(data) {
				const rows = data.results.bindings;
				return callback(null, rows);
			})
			.catch(function(err) {
				return callback(err);
			});
	}
	
	// GetReposFromOrg(appData, organisation, callback) {
	// 	// Theres no cache fallback here, this ain't a heavy call
	// 	// Note that they are not added again to the AppData if the repo is already there
	// 	// So, any repo-level changes in the data are not stored
	// 	this.callPromise(appData, '/orgs/' + organisation + '/repos')
	// 		.then((data) => {
	// 			data.forEach((repo) => { 
	// 				new Repo(appData, repo);
	// 			});
	// 			callback();
	// 		});
	// }
}

export default SPARQL;