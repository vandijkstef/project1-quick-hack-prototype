// import API from './API.js';
// import Repo from './Repo.js';

class SPARQL {
	constructor(server, postquery = '') {
		this.server = server;
		this.postQuery = postquery;
	}

	Fetch(query, callback) {
		console.log(this.server);
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
}

export default SPARQL;