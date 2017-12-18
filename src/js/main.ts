import { app } from './decorators/render';
import * as Utils from './utils';

import { AppState, OnAppStateChange, OnAppStateChangeTo, SetCurrentAppState, SearchLocation } from './app_state';

import { BirthTimeComponent } from './components/birth_time';
import { ChartDisplayComponent } from './components/chart_display';
import { LocationSearchComponent } from './components/location_search';

let appRef = app;
OnAppStateChange().subscribe(() => appRef.render());

let location_search_component = new LocationSearchComponent();
let birth_time_component = new BirthTimeComponent();
let chart_display_component = new ChartDisplayComponent();

Utils.getID('title').addEventListener('click', () => SetCurrentAppState(new SearchLocation()));

OnAppStateChangeTo(SearchLocation)
	.subscribe(() => app.reset());
