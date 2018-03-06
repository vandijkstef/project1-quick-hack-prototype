import UIT from '../UItools/UItools.js';

class Station {
	constructor(data) {
		this._data = data;
	
		this.name = data.name.value;
		this.adamLink = data.url.value;
		this.additionalData = this.ParseAdditionalDataUrl(data.additionalData.value);
		this.stationType = this.GetType(data.type.value);
		this._element = this.Render();
		console.log(this);
	}

	ParseAdditionalDataUrl(url) {
		const urlArray = url.split('/');
		const additionalData = {
			type: urlArray[2],
			id: urlArray[4]
		};
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

	Render() {
		return UIT.renderText(this.name + ' | ' + this.stationType, document.body)[0];
	}

}

export default Station;