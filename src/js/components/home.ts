import { hidden, html, Render, RenderComponent } from '../decorators/render';
import { Bind } from '../decorators/bind';
import { icon } from '../utils';
import { Subject } from 'rxjs/Subject';
import localForage from 'localforage';

import { Chart } from '../models/chart';
import { Planet } from '../models/planet';
import { Element, Sign } from '../models/sign';

import { AppState, DisplayChart, SearchLocation } from '../models/app_state';
import { App } from '../models/app';

@Render('HomeComponent',
function(this: HomeComponent) {
	return html`
<div id="home" class$=${hidden(App.isState(AppState.Home) === false)}>
	<div class="new">
		<button on-click=${() => this.new_chart()}>new!</button>
	</div>
	${this.charts.map(chart => {
		let sun_sign = chart.placements.get(Planet.Sun)!.sign;
		let sun_element = Element[Sign.GetElement(sun_sign)];
		let moon_sign = chart.placements.get(Planet.Moon)!.sign;
		let moon_element = Element[Sign.GetElement(moon_sign)];
		return html`
	<a href="javascript:void(0)" on-click=${() => this.load_chart(chart)}>
	<div class="chart">
		<div class="delete">
			<button on-click=${(e: Event) => this.delete_chart(chart, e)}
				data-balloon="Delete!" data-balloon-pos="down">
				${icon('symbol--delete')}
			</button>
		</div>
		<div class="name" text$=${chart.name}>${chart.name}</div>
		<div class$="sun ${sun_element.toLowerCase()}">
			${icon(`planet--sun`)}
		</div>
		<div class$="sun-sign ${sun_element.toLowerCase()}">
			${icon(`sign--${Sign[sun_sign]}`)}
		</div>
		<div class$="moon ${moon_element.toLowerCase()}">
			${icon(`planet--moon`)}
		</div>
		<div class$="moon-sign ${moon_element.toLowerCase()}">
			${icon(`sign--${Sign[moon_sign]}`)}
		</div>
	</div>
	</a>
	`})}
</div>`;
})
export class HomeComponent implements RenderComponent {
	triggerRender: Subject<null>;
	charts: Chart[];

	constructor() {
		this.triggerRender = new Subject();
		this.charts = [];
	}

	reset(): Promise<void> {
		this.charts = [];
		return localForage.keys()
			.then(keys => Promise.all(keys.map(k => localForage.getItem(k))))
			.then(values => {
				values.forEach(json => {
					let chart = Chart.fromJSON(json, true);
					if (chart != null) {
						this.charts.push(chart);
					}
				});
				this.triggerRender.next(null);
			});
	}

	new_chart() {
		App.changeState(new SearchLocation());
	}

	load_chart(chart: Chart) {
		App.changeState(new DisplayChart(chart));
	}

	delete_chart(chart: Chart, e: Event) {
		e.preventDefault();
		e.stopPropagation();
		localForage.removeItem(chart.name)
			.then(() => this.reset());
	}
}
