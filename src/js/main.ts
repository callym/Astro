import * as Utils from './utils';

import { App } from './models/app';
import { Home, SearchLocation, DisplayChart } from './models/app_state';

import { Chart } from './models/chart';
import { Location as AppLocation } from './models/location';

import { BirthTimeComponent } from './components/birth_time';
import { ChartDisplayComponent } from './components/chart_display';
import { LocationSearchComponent } from './components/location_search';

App.register(
	LocationSearchComponent,
	BirthTimeComponent,
	ChartDisplayComponent,
);

Utils.getID('title').addEventListener('click', () => {
	App.resetState(new Home());
	App.changeState(new SearchLocation());
	window.history.replaceState({}, '', `${location.pathname}`);
});

App.onStateChangeTo(DisplayChart)
	.subscribe(chart_display => {
		let params = new URLSearchParams();
		params.set('location', JSON.stringify(chart_display.chart.location));
		params.set('date', chart_display.chart.date.toISOString());
		params.set('display_date', chart_display.chart.display_date);
		window.history.replaceState({}, '', `${location.pathname}?${params}`);
	});

document.addEventListener('DOMContentLoaded', () => {
	let params = new URLSearchParams(location.search);
	let address = params.get('location');
	let loc = address != null ? AppLocation.fromJSON(address) : null;
	let date = params.get('date');
	let display_date = params.get('display_date');
	if (loc != null && date != null && display_date != null) {
		Chart.withPlacements(
			new Date(date),
			loc,
			display_date,
		).then(chart => App.changeState(new DisplayChart(chart)));
		return;
	}

	App.changeState(new SearchLocation());
})
