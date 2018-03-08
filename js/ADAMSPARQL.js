import SPARQL from './SPARQL.js';

class ADAMSPARQL extends SPARQL {
	constructor() {
		super('https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=', '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on');
	}
}

export default ADAMSPARQL;
