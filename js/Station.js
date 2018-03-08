import UIT from '../UItools/UItools.js';
import API from './API.js';
// import SPARQL from './SPARQL.js';

class Station {
	constructor(data) {
		this._data = data;
	
		this.name = data.name.value;
		this.additionalData = this.ParseAdditionalDataUrl(data.additionalData.value);
		this.stationType = this.GetType(data.type.value);
		this.urls = {
			adam: data.url.value,
			additionalData: data.additionalData.value
		};
		this.created = '0';
	}

	ParseAdditionalDataUrl(url) {
		const urlArray = url.split('/');
		const additionalData = {
			type: urlArray[2],
			id: urlArray[4]
		};
		if (additionalData.type === 'verdwenengebouwen.nl') {
			this.deprecated = true;
		}
		return additionalData;
	}

	GetType(typeUrl) {
		switch (typeUrl.slice(-1)) {
		case '0':
			return 'subway';
		case '3':
			return 'train';
		default: 
			return undefined;
		}
	}

	Click(e) {
		console.log(e.target);
	}

	Focus() {
		this._element.scrollIntoView();
	}

	Render(timelineElement, scales) {
		this.scales = scales;
		const classes = [];
		classes.push('station');
		classes.push(this.stationType);
		if (this.deprecated) {
			classes.push('deprecated');
		}
		let testText = UIT.getText(this.name, 'name');
		this._element = UIT.renderIn([UIT.getImage('/img/train-station.svg'), testText], timelineElement, classes)[0];
	}

	PostRender() {
		// Create all the additional elements
		// Or... whatever
		this.Update();
	}

	Update() {
		// Actually update the elements
		let existanceText = '';
		if (this.created !== '0') {
			existanceText += this.created;
			this._element.dataset.created = this.created;
		} else {
			this.created = this.scales.minYear;
		}
		if (this.destroyed) {
			existanceText += ' - ' + this.destroyed;
			this._element.dataset.destroyed = this.destroyed;
		} else {
			this.destroyed = this.scales.currentYear;
		}
		UIT.renderIn(UIT.getText(existanceText), this._element);
		
		this.scales.leftOffset = (this.created - this.scales.minYear) * this.scales.unitsPerYear;
		this._element.style.left = this.scales.leftOffset + 'px';
		this._element.style.width = (this.destroyed - this.created) * this.scales.unitsPerYear + 'px';

		if (!this.expanded) {
			this._element.classList.add('nodata');
		}
		if (this.created === this.scales.minYear) {
			this.Focus();
		}
	}

	Expand(callback) {
		if (this.additionalData.type === 'verdwenengebouwen.nl') {
			this.ExpandVerdwenenGebouwen((bool) => {
				return callback(bool);
			});
		} else if (this.additionalData.type === 'www.wikidata.org') {
			this.ExpandWikiDataTheirCode((bool) => {
				return callback(bool);
			});
		} else {
			console.warn(`No additional data for ${this.name}`);
			return callback(true);
		}
	}

	ExpandVerdwenenGebouwen(callback) {
		const api = new API('http://verdwenengebouwen.nl/');
		api.callCallback(`gebouw/json/${this.additionalData.id}`, (data) => {
			this.expanded = true;
			this.geoPos = {
				lat: data.lat,
				lon: data.lon
			};
			this.created = data.startmin;
			this.destroyed = data.endmin || 2018;
			this.urls.wiki = data.wiki;
			this.images = [];
			data.depictions.forEach((img) => {
				this.images.push(img);
			});
			this.description = data.description;
			return callback(true);
		});
	}

	ExpandWikiData() {
		// We didn't get this working on our own class. We used WikiData provided code instead in ExpandWikiDataTheirCode();
	}

	ExpandWikiDataTheirCode(callback) {
		// This method is copied from WikiData
		const endpointUrl = 'https://query.wikidata.org/sparql';
		const sparqlQuery = `
		SELECT * WHERE {
			{
				?item wdt:P31 wd:Q1339195 .
				optional {?item wdt:P1619 ?opening} .
				optional {?item wdt:P18 ?image} .
				optional {?item wdt:P625 ?geo} .
				optional {?item wdt:P197 ?adjStations} .
				optional {?item wdt:P131 ?city} .
				optional {?city wdt:P373 ?cityName }
				SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
				FILTER(?item IN (wd:${this.additionalData.id}))
			} UNION {
				?item wdt:P31 wd:Q55488 .
				optional {?item wdt:P1619 ?opening} .
				optional {?item wdt:P18 ?image} .
				optional {?item wdt:P625 ?geo} .
				optional {?item wdt:P197 ?adjStations} .
				optional {?item wdt:P131 ?city} .
				optional {?city wdt:P373 ?cityName }
				SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
				FILTER(?item IN (wd:${this.additionalData.id}))
			} UNION {
				?item wdt:P31 wd:Q3201814 .
				optional {?item wdt:P1619 ?opening} .
				optional {?item wdt:P18 ?image} .
				optional {?item wdt:P625 ?geo} .
				optional {?item wdt:P197 ?adjStations} .
				optional {?item wdt:P131 ?city} .
				optional {?city wdt:P373 ?cityName }
				SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
				FILTER(?item IN (wd:${this.additionalData.id}))
			}
		}`;

		const fullUrl = endpointUrl + '?query=' + encodeURIComponent( sparqlQuery );

		const headers = { 'Accept': 'application/sparql-results+json' };

		fetch(fullUrl, {headers})
			.then(body => body.json())
			.then((json) => {
				const {head: {vars}, results} = json;
				this.expanded = true;
				for (const result of results.bindings ) {
					// for ( const variable of vars ) {

					// this.expanded = true;
					// this.geoPos = {
					// 	lat: data.lat,
					// 	lon: data.lon
					// };
					// this.destroyed = data.endmin;
					// this.urls.wiki = data.wiki;
					// this.images = [];
					// data.depictions.forEach((img) => {
					// 	this.images.push(img);
					// });
					// this.description = data.description;
						
					// }
					if (result['opening']) {
						this.created = new Date(result['opening'].value).getFullYear();
					}
					this.destroyed = 2018;
				}
				return callback(true);
			});
	}
}

export default Station;