import { Planet } from './planet';
import { Sign } from './sign';

let api = 'http://localhost:30443';

class Placement {
	public planet: Planet;
	public sign: Sign;
	public degrees: number;

	constructor(planet: string, sign: string, degrees: number) {
		this.planet = (<any>Planet)[planet];
		this.sign = (<any>Sign)[sign];
		this.degrees = degrees;
	}
}

function component(): HTMLDivElement {
	let element = document.createElement('div');
	element.innerHTML = 'hello world!';
	return element;
}

function chart(): Promise<Placement[]> {
	let headers = new Headers();
	headers.append('Content-Type', 'application/json');

	let request = new Request(`${api}/zodiac/chart`, {
		method: 'POST',
		headers: headers,
		mode: 'cors',
		body: JSON.stringify({
			date: "1995-06-27",
			time: "14:14:00",
		})
	});

	return fetch(request)
		.then(res => res.json())
		.then(json => Object.entries(json)
				.map(([_, value]) => new Placement(
					value.planet,
					value.sign,
					value.degrees)
				)
			);
}

chart().then(v => console.log(v));

document.body.appendChild(component());
