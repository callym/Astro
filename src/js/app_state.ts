import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Chart } from './chart';
import { Location } from './location';

export enum AppState {
	SearchLocation,
	SelectTime,
	DisplayChart,
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

export type AppStates = SearchLocation | SelectTime | DisplayChart;

export let _currentAppState: BehaviorSubject<AppStates> = new BehaviorSubject<AppStates>(new SearchLocation());

export function CurrentAppState(): AppStates {
	return _currentAppState.value;
}

export function OnAppStateChange(): Observable<AppStates> {
	return _currentAppState.asObservable();
}

export function OnAppStateChangeTo<T extends AppStates>(type: new(...args: any[]) => T): Observable<T> {
	function guard(value: AppStates): value is T {
		return Object.getPrototypeOf(value) === type.prototype;
	};

	return OnAppStateChange()
		.filter(guard);
}

export function SetCurrentAppState(state: AppStates) {
	_currentAppState.next(state);
}
