import { App } from './app';
import { Location } from './location';
import { Placement } from './placement';
import { Planet } from './planet';
import * as Utils from '../utils';

let process = {
	env: {
		NODE_ENV: '',
	},
};

export class Chart {
	public name: string;
	public display_date: string;
	public date: Date;
	public location: Location;
	public placements: Map<Planet, Placement>;

	private constructor() { }

	static fromJSON(data: any, parsed?: boolean): Chart | null {
		if (parsed !== true) {
			data = JSON.parse(data);
		}

		if (data == null || data.display_date == null ||
			data.date == null || data.location == null ||
			data.placements == null || data.name == null) {
			return null;
		}

		let chart = new Chart();
		chart.name = data.name;
		chart.display_date = data.display_date;
		chart.date = data.date;
		chart.location = Location.fromJSON(data.location, parsed);
		chart.placements = data.placements;

		return chart;
	}

	static withPlacements(name: string, date: Date, location: Location, display_date: string): Promise<Chart> {
		let api: string = process.env.NODE_ENV === 'production' ? 'https://api.callym.com' : 'https://192.168.0.22:30443';

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

		return Utils.fetchDelay(request)
			.then(res => res.json())
			.then(json => Object.entries(json)
				.map(([_, value]): [Planet, Placement] => {
					let placement = new Placement(
						value.planet,
						value.sign,
						value.degrees,
						value.retrograde);
					return [placement.planet, placement];
				}))
			.then(placements => {
				let chart = new Chart();
				chart.name = name;
				chart.display_date = display_date;
				chart.date = date;
				chart.location = location;
				chart.placements = new Map(placements);
				return chart;
			});
	}
}
