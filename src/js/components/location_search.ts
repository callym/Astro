import { hidden, html, Render, RenderComponent } from '../decorators/render';
import { Bind } from '../decorators/bind';
import * as Utils from '../utils';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Location } from '../models/location';
import { App } from '../models/app';
import { SelectTime, AppState, SearchLocation } from '../models/app_state';

enum State {
	Name,
	Location,
}

@Render('LocationSearchComponent',
function(this: LocationSearchComponent) {
	return html`
<div class$=${hidden(App.isState(AppState.SearchLocation) === false)}>
<form>
<fieldset id="chart_name" class$=${hidden(this.state != State.Name)}>
	<legend>Name</legend>
	<div>
		<label for="name">Name</label>
		<input id="name" type="text">
	</div>
	<button id="name_set" on-click=${(e: Event) => this.set_name(e)}>go!</button>
</fieldset>
</form>
<form>
<form>
<fieldset id="birth_location" class$=${hidden(this.state != State.Location)}>
	<legend>Birth Location</legend>
	<div>
		<label for="location">Location</label>
		<input id="location" type="text">
	</div>
	<button id="location_search" on-click=${(e: Event) => this.search(e)}>go!</button>
</fieldset>
</form>
<form>
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
	<button id="location_select" on-click=${(e: Event) => this.select(e)}>go!</button>
</fieldset>
</form>
</div>`;
})
export class LocationSearchComponent implements RenderComponent {
	triggerRender: Subject<null>;
	@Bind private state: State;
	@Bind private locations: Location[];
	@Bind private name: string;

	constructor() {
		this.triggerRender = new Subject();
		this.state = State.Name;
		this.locations = [];
		this.name = '';
	}

	init() {
		App.onStateChangeTo(SearchLocation)
			.subscribe(() => Utils.getID('name').focus());
	}

	reset() {
		this.state = State.Name;
		this.locations = [];
		this.name = '';
		Utils.getID<HTMLInputElement>('location').value = '';
		Utils.getID<HTMLInputElement>('name').value = '';
	}

	set_name(e: Event) {
		e.preventDefault();
		let input = Utils.getID<HTMLInputElement>('name');
		setTimeout(() => Utils.getID('location').focus(), 0);
		this.name = input.value;
		this.state = State.Location;
	}

	search(e: Event) {
		e.preventDefault();
		let input = Utils.getID<HTMLInputElement>('location');
		Location.search(input.value)
			.then(locations => this.locations = locations)
			.then(() => setTimeout(() => Utils.getID('location_select').focus(), 0))
			.then(() => App.removeLoading());
	}

	select(e: Event) {
		e.preventDefault();
		let select_el = Utils.getID<HTMLSelectElement>('results');
		if (select_el == null) {
			return;
		}

		let location = Location.fromJSON(select_el.value);

		App.changeState(new SelectTime(location, this.name));
	}
}
