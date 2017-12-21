import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Chart } from './chart';
import { Location } from './location';

export enum AppState {
	Home,
	SearchLocation,
	SelectTime,
	DisplayChart,
}

export class Home {
	state: AppState.Home = AppState.Home;
}

export class SearchLocation {
	state: AppState.SearchLocation = AppState.SearchLocation;
}

export class SelectTime {
	state: AppState.SelectTime = AppState.SelectTime;
	location: Location;

	constructor(location: Location) {
		this.location = location;
	}
}

export class DisplayChart {
	state: AppState.DisplayChart = AppState.DisplayChart;
	chart: Chart;

	constructor(chart: Chart) {
		this.chart = chart;
	}
}

export type AppStates = Home | SearchLocation | SelectTime | DisplayChart;
