class App {
	constructor() {


		const sparql = `SELECT * WHERE {
			  ?url dc:type <http://vocab.getty.edu/aat/300007780> .
			  ?url rdfs:label ?q
		}`;
		const query = encodeURIComponent(sparql);
		var queryUrl = 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=' + query + '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';

		fetch(queryUrl)
			.then((res) => res.json())
			.then(function(data) {
				const rows = data.results.bindings;
				console.log(rows[0]);
			})
			.catch(function(err) {
				console.warn(err);
			});

			
	}
}


document.addEventListener('DOMContentLoaded', () => {
	new App();
});