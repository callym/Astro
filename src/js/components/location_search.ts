import { hidden, html, Render, RenderComponent } from '../decorators/render';
import { Bind } from '../decorators/bind';
import * as Utils from '../utils';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Location } from '../models/location';
import { App } from '../models/app';
import { SelectTime, AppState } from '../models/app_state';

interface LocationSearchData {
	input: string;
}

@Render(
function(this: LocationSearchComponent) {
	return html`
<div class$=${hidden(App.isState(AppState.SearchLocation) === false)}>
<fieldset id="birth_location">
	<legend>Birth Location</legend>
	<div>
		<label for="location">Location</label>
		<input id="location" type="text">
	</div>
	<button id="location_search" on-click=${() => this.search()}>go!</button>
</fieldset>
<fieldset id="location_results" class$=${hidden(this.locations.length <= 0)}>
	<legend>Location Results</legend>
	<div>
		<label for="results">Location</label>
		<select id="results">
		${this.locations.map(l => html`
			<option value='${JSON.stringify(l)}'>${l.address}</option>`
		)}
		</select>
	</div>
	<button id="location_select" on-click=${() => this.select()}>go!</button>
</fieldset>
</div>`;
})
export class LocationSearchComponent implements RenderComponent {
	triggerRender: Subject<null>;
	@Bind private locations: Location[];

	constructor() {
		this.triggerRender = new Subject();
		this.locations = [];
	}

	reset() {
		this.locations = [];
		Utils.getID<HTMLInputElement>('location').value = '';
	}

	search() {
		let input = Utils.getID<HTMLInputElement>('location');
		Location.search(input.value)
			.then(locations => this.locations = locations);
	}

	select() {
		let select_el = Utils.getID<HTMLSelectElement>('results');
		if (select_el == null) {
			return;
		}

		let location = Location.fromJSON(select_el.value);

		App.changeState(new SelectTime(location));
	}
}
