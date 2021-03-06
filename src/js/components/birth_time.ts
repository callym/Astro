import flatpickr from 'flatpickr';
import { Subject } from 'rxjs/Subject';

import { hidden, html, Render, RenderComponent } from '../decorators/render';
import * as Utils from '../utils';

import { Chart } from '../models/chart';
import { Location } from '../models/location';

import { App } from '../models/app';
import { SelectTime, AppState, DisplayChart } from '../models/app_state';


@Render('BirthTimeComponent',
function(this: BirthTimeComponent) {
	return html`
<form id="birth_details" class$=${hidden(App.isState(AppState.SelectTime) === false)}>
<fieldset>
	<legend>Birth Details</legend>
	<div>
		<label for="date">Date</label>
		<input id="date" type="text">
	</div>
	<div>
		<label for="time">Time</label>
		<input id="time" type="text">
	</div>
	<div>
		<label for="time_unknown">Time Unknown</label>
		<input type="checkbox" id="time_unknown" on-change=${(e: Event) => this.time_unknown(e)}>
		<div class="checkbox"></div>
	</div>
	<button id="date_choose" on-click=${(e: Event) => this.select(e)}>go!</button>
</fieldset>
</form>`;
})
export class BirthTimeComponent implements RenderComponent {
	triggerRender: Subject<null>;

	constructor() {
		this.triggerRender = new Subject();
	}

	reset() {

	}

	init() {
		let date = flatpickr('#date', {
			altInput: true,
			defaultDate: new Date(1995, 5, 27).setHours(12, 0, 0, 0),
		});

		let time = flatpickr('#time', {
			enableTime: true,
			time_24hr: true,
			altInput: true,
			noCalendar: true,
			altFormat: 'H:i',
			defaultDate: new Date(1995, 5, 27).setHours(14, 14, 0, 0),
		});
	}

	time_unknown(e: Event) {
		let time = (<any>Utils.getID('time'))._flatpickr;
		let time_input = (<any>time).altInput as HTMLInputElement;
		if ((<HTMLInputElement>e.target).checked === true) {
			time_input.disabled = true;
		} else {
			time_input.disabled = false;
		}
	}

	select(e: Event) {
		e.preventDefault();

		let current_app_state = App.getState();
		if (current_app_state.state !== AppState.SelectTime) {
			return;
		}

		let date = (<any>Utils.getID('date'))._flatpickr;
		let time = (<any>Utils.getID('time'))._flatpickr;
		let time_unknown = Utils.getID<HTMLInputElement>('time_unknown');
		let name = current_app_state.name;
		let location = current_app_state.location;

		let chart_date: Date = (<any>date).selectedDates[0];
		let chart_time = new Date(chart_date);
		chart_time.setHours(12, 0, 0, 0);

		if (time_unknown != null && time_unknown.checked === false) {
			let ct = (<any>time).selectedDates[0];
			chart_time.setHours(
				ct.getHours(),
				ct.getMinutes(),
				ct.getSeconds());
		}

		chart_date.setHours(
			chart_time.getHours(),
			chart_time.getMinutes(),
			chart_time.getSeconds());

		let display_date = `${date.altInput.value}, ${time.altInput.value}`;

		location.get_time(chart_date)
			.then(date => Chart.withPlacements(name, date, location, display_date))
			.then(chart => App.changeState(new DisplayChart(chart)))
			.then(() => App.removeLoading())
			.then(() => App.removeLoading());
	}
}
