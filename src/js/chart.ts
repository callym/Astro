import { Location } from './location';
import { Placement } from './placement';

export class Chart {
	public date: Date;
	public location: Location;
	public placements: Placement[];

	private constructor() { }

	static withPlacements(date: Date, location: Location): Promise<Chart> {
		let api = 'http://localhost:30443';

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		let request = new Request(`${api}/zodiac/chart`, {
			method: 'POST',
			headers: headers,
			mode: 'cors',
			body: JSON.stringify({
				date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
				time: `${date.getHours()}:${date.getMinutes()}:00`,
			})
		});

		return fetch(request)
			.then(res => res.json())
			.then(json => Object.entries(json)
				.map(([_, value]) => new Placement(
					value.planet,
					value.sign,
					value.degrees)
				))
			.then(placements => {
				let chart = new Chart();
				chart.date = date;
				chart.location = location;
				chart.placements = placements;
				return chart;
			});
	}
}
