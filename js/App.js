import SPARQL from './SPARQL.js';
import Station from './Station.js';

class App {
	constructor() {
		this.appData = {};
		this.GetAllStations();
	}

	GetAllStations() {
		this.appData.stations = [];

		const sparql = new SPARQL();
		const query = `
		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
		PREFIX dc: <http://purl.org/dc/elements/1.1/>
		PREFIX owl: <http://www.w3.org/2002/07/owl#>

		SELECT * WHERE {
			{
				?url dc:type <http://vocab.getty.edu/aat/300007780> .
				?url rdfs:label ?name . 
				?url dc:type ?type .
				?url owl:sameAs ?additionalData
			}
			UNION
			{
				?url dc:type <http://vocab.getty.edu/aat/300007783> .
				?url rdfs:label ?name . 
				?url dc:type ?type .
				?url owl:sameAs ?additionalData
			}
		}`;

		sparql.Fetch(query, (err, data) => {
			if (err) {
				console.warn(err);
			} else {
				// Push all data into our apps data
				data.forEach((element) => {
					this.appData.stations.push(new Station(element));
				});
			}
		});
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new App();
});