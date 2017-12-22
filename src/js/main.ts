import * as Utils from './utils';

import { App } from './models/app';
import { Home, SearchLocation, DisplayChart } from './models/app_state';

import { Chart } from './models/chart';
import { Location as AppLocation } from './models/location';

import { BirthTimeComponent } from './components/birth_time';
import { ChartDisplayComponent } from './components/chart_display';
import { HomeComponent } from './components/home';
import { LocationSearchComponent } from './components/location_search';
import { LoadingComponent } from './components/loading';

App.register(
	LoadingComponent,
	HomeComponent,
	LocationSearchComponent,
	BirthTimeComponent,
	ChartDisplayComponent,
);

let loaded = new Promise<null>(resolve => {
	document.addEventListener('DOMContentLoaded', () => {
		App.init()
			.then(() => reset())
			.then(() => resolve());
	})
});

loaded.then(() => {
	Utils.getID('title').addEventListener('click', () => {
		window.history.replaceState({}, '', location.pathname);
		reset();
	});
});

function reset() {
	return App.resetState(new Home())
		.then(() => {
			let params = new URLSearchParams(location.search);
			let name = params.get('name');
			let address = params.get('location');
			let loc = address != null ? AppLocation.fromJSON(address) : null;
			let date = params.get('date');
			let display_date = params.get('display_date');
			if (name != null && loc != null && date != null && display_date != null) {
				Chart.withPlacements(
					name,
					new Date(date),
					loc,
					display_date,
				)
				.then(chart => App.changeState(new DisplayChart(chart)))
				.then(() => App.removeLoading());

				return;
			}

			let home = App.get(HomeComponent);
			if (home == null || home.charts.length <= 0) {
				App.changeState(new SearchLocation());
			}
		})
		.then(() => Utils.getID('app_container').classList.remove('hidden'));
};
