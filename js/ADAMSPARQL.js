import SPARQL from './SPARQL.js';

class ADAMSPARQL extends SPARQL {
	constructor() {
		let server = 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/hva2018/sparql?default-graph-uri=&query=';
		const querystr = new URLSearchParams(window.location.search);
		if (querystr.get('live')) {
			server = 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=';
		}
		super(server, '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on');

		
	}
}

export default ADAMSPARQL;
