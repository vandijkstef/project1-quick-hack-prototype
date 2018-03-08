import ADAMSPARQL from './ADAMSPARQL.js';
import Station from './Station.js';
import UItools from '../UItools/UItools.js';

class App {
	constructor() {
		this.appData = {};
		this.GetAllStations();
		console.log(this.appData);
		this.timelineWrap = UItools.render(UItools.createElement('', 'timeline', 'section'), document.body)[0];
	}

	GetAllStations() {
		this.appData.stations = [];

		const sparql = new ADAMSPARQL();
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
			} UNION	{
				?url dc:type <http://vocab.getty.edu/aat/300007783> .
				?url rdfs:label ?name . 
				?url dc:type ?type .
				?url owl:sameAs ?additionalData
			}
		}`;

		sparql.Fetch(query, (err, data) => {
			if (err) {
				console.warn(err);
				UItools.renderText('Something went wrong, please try again later', document.body, 'error');
			} else {
				// Push all data into our apps data
				data.forEach((element) => {
					this.appData.stations.push(new Station(element));
				});
				this.ExpandData();
			}
		});
	}

	ExpandData() {
		if (!this.expandCounter) {
			this.expandCounter = 0;
		}
		if (this.expandCounter < this.appData.stations.length) {
			this.appData.stations[this.expandCounter].Expand((bool) => {
				this.expandCounter++;
				if (bool) {
					this.ExpandData();
				}
			});
		} else {
			this.RenderTimeline();
		}
	}

	RenderTimeline() {
		// TODO: Before we do this: test if we can merge/clean more data (Amsterdam Centraal is a good example, having 3 versions of itself. They should be collapsible based on ids)
		document.body.style.width = this.Scales().totalWidth;
		this.RenderYears();
		this.appData.stations.sort((station1, station2) => {
			return station2.created - station1.created;
		});
		this.appData.stations.forEach((station) => {
			station.Render(this.timelineWrap, this.Scales());
			station.PostRender();
		});
	}

	Scales() {
		if (!this.scales) {
			this.scales = {};
			this.scales.currentYear = 2018;
			this.scales.totalWidth = 6000;
			this.scales.minYear = this.GetMinimumYear();
			this.scales.unitsPerYear = this.scales.totalWidth / (this.scales.currentYear - this.scales.minYear);
		}
		return this.scales;
	}

	GetMinimumYear() {
		let minYear = 9999;
		this.appData.stations.forEach((station) => {
			if (station.created < minYear && station.created !== '0') {
				minYear = station.created;
			}
		});
		return minYear;
	}

	RenderYears() {
		const timeline = UItools.render(UItools.createElement('', 'years', 'section'), document.body)[0];
		// Render first year
		this.SetYear(UItools.render(UItools.getText(this.scales.minYear), timeline)[0]);
		// Render inbetween years
		let yearStep = this.scales.minYear;
		while (yearStep < this.scales.currentYear) {
			if (yearStep % 10 === 0) {
				this.SetYear(UItools.render(UItools.getText(yearStep), timeline)[0]);
			}
			yearStep++;
		}
		// Render last year
		this.SetYear(UItools.render(UItools.getText(this.scales.currentYear), timeline)[0]);
	}

	SetYear(yearElement) {
		let padding = .5;
		if (yearElement.innerText == this.scales.minYear) {
			padding = 0;
		} else if (yearElement.innerText == this.scales.currentYear) {
			padding = 1.5;
		}
		const leftOffset = (yearElement.innerText - padding - this.scales.minYear) * this.scales.unitsPerYear;
		yearElement.style.left = leftOffset + 'px';
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new App();
});