import UIT from '../UItools/UItools.js';

class Station {
	constructor(data) {
		this._data = data;
	
		this.name = data.name.value;
		this.adamLink = data.url.value;
		this.additionalData = this.ParseAdditionalDataUrl(data.additionalData.value);
		this.stationType = this.GetType(data.type.value);
		
		this._element = this.Render();
		// this._element.dataset.data = JSON.stringify(this);
		// UIT.addHandler(this._element, this.Click);
		// console.log(this);
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

	Render() {
		const classes = [];
		classes.push('station');
		classes.push(this.stationType);
		if (this.deprecated) {
			classes.push('deprecated');
		}
		let testText = UIT.getText(this.name + ' | ' + this.stationType + ' | ' + this.additionalData.type, 'name');
		return UIT.renderIn(testText, document.body, classes)[0];
	}

}

export default Station;