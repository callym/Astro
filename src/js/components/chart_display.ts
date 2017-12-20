import { hidden, html, Render, RenderComponent } from '../decorators/render';
import { Bind } from '../decorators/bind';
import { Subject } from 'rxjs/Subject';

import { Chart } from '../chart';
import { Planet } from '../planet';
import { Sign } from '../sign';
import { CurrentAppState, OnAppStateChangeTo, AppState, DisplayChart } from '../app_state';

@Render(
function(this: ChartDisplayComponent) {
	return html`
<div class$=${hidden(CurrentAppState().state !== AppState.DisplayChart)}>
<div id="chart">
	${this.chart != null ? this.chart.placements.map(p => html`
		<div class="placement">
			<div class="planet">${Planet[p.planet]}</div>
			<div class="sign">${Sign[p.sign]}</div>
		</div>
	`) : html``}
</div>
</div>`;
})
export class ChartDisplayComponent implements RenderComponent {
	triggerRender: Subject<null>;

	@Bind chart: Chart | null;

	constructor() {
		this.triggerRender = new Subject();
		OnAppStateChangeTo(DisplayChart)
			.subscribe(s => this.chart = s.chart);
	}

	reset() {
		this.chart = null;
	}
}
