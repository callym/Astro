import { App } from './app';
import { Observable } from 'rxjs/Observable';
import * as Utils from '../utils';

export class Location {
	address: string;
	location: {
		lat: number;
		lng: number;
	};

	constructor(address: string, location: { lat: number, lng: number}) {
		this.address = address;
		this.location = location;
	}

	public static fromJSON(json: any): Location {
		json = JSON.parse(json);
		return new Location(json.address, json.location);
	}

	public static search(search: string): Promise<Location[]> {
		let api = 'https://maps.googleapis.com/maps/api/geocode/json?';
		api += `address=${search}`;
		api += '&key= AIzaSyDNOc1GWJ7NwGbdIBtZhVExnfqqQSh2-SU';

		let request = new Request(`${api}`, {
			method: 'GET',
			mode: 'cors',
		});

		return Utils.fetchDelay(request)
			.then(res => res.json())
			.then(json => {
				if (json.status === 'OK') {
					return json.results;
				}
				return [];
			})
			.then((json: any[]) => {
				return json.map(r => new Location(
					r.formatted_address,
					r.geometry.location))
			});
	}

	public get_time(date: Date): Promise<Date> {
		let seconds = date.valueOf() / 1000.0;
		let api = 'https://maps.googleapis.com/maps/api/timezone/json?'
		api += `location=${this.location.lat},${this.location.lng}`;
		api += `&timestamp=${seconds}`;
		api += `&key=AIzaSyD01njwgIwI0MUio6SvyymtSm1LZubh8do`;

		let request = new Request(`${api}`, {
			method: 'GET',
			mode: 'cors',
		});

		return Utils.fetchDelay(request)
			.then(res => res.json())
			.then(json => {
				if (json.status === 'OK') {
					seconds -= json.rawOffset;
					seconds -= json.dstOffset;
					return new Date(seconds * 1000.0);
				}
				throw json.status;
			});
	}
}
