import flatpickr from 'flatpickr';
import { Subject } from 'rxjs/Subject';

import { hidden, html, Render, RenderComponent } from '../decorators/render';
import * as Utils from '../utils';

import { Chart } from '../chart';
import { Location } from '../location';
import { CurrentAppState, SelectTime, AppState, SetCurrentAppState, DisplayChart } from '../app_state';


@Render(
function(this: BirthTimeComponent) {
	return html`
<fieldset id="birth_details" class$=${hidden(CurrentAppState().state !== AppState.SelectTime)}>
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
	<button id="date_choose" on-click=${() => this.select()}>go!</button>
</fieldset>`;
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
			defaultDate: new Date(1995, 5, 27),
		});

		let time = flatpickr('#time', {
			enableTime: true,
			time_24hr: true,
			altInput: true,
			noCalendar: true,
			dateFormat: 'H:i',
			defaultDate: new Date().setHours(14, 14, 0, 0),
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

	select() {
		let current_app_state = CurrentAppState();
		if (current_app_state.state !== AppState.SelectTime) {
			return;
		}

		let date = (<any>Utils.getID('date'))._flatpickr;
		let time = (<any>Utils.getID('time'))._flatpickr;
		let time_unknown = Utils.getID<HTMLInputElement>('time_unknown');
		let location = current_app_state.location;

		let chart_date: Date = (<any>date).selectedDates[0];
		let chart_time = new Date();
		chart_time.setHours(12, 0, 0, 0);

		if (time_unknown != null && time_unknown.checked === false) {
			chart_time = (<any>time).selectedDates[0];
		}

		chart_date.setHours(chart_time.getHours(), chart_time.getMinutes(), chart_time.getSeconds());

		location.get_time(chart_date)
			.then(date => Chart.withPlacements(date, location))
			.then(chart => SetCurrentAppState(new DisplayChart(chart)));
	}
}
