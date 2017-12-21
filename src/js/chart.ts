import { Location } from './location';
import { Placement } from './placement';

export class Chart {
	public display_date: string;
	public date: Date;
	public location: Location;
	public placements: Placement[];

	private constructor() { }

		let api = 'http://localhost:30443';
	static withPlacements(date: Date, location: Location, display_date: string): Promise<Chart> {

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
					value.degrees,
					value.retrograde)
				))
			.then(placements => {
				let chart = new Chart();
				chart.display_date = display_date;
				chart.date = date;
				chart.location = location;
				chart.placements = placements;
				return chart;
			});
	}
}
