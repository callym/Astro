import { hidden, html, Render, RenderComponent } from '../decorators/render';
import { Bind } from '../decorators/bind';
import { Subject } from 'rxjs/Subject';

import { Chart } from '../chart';
import { Planet } from '../planet';
import { Sign, Element, Modality } from '../sign';
import { CurrentAppState, OnAppStateChangeTo, AppState, DisplayChart } from '../app_state';
import { Placement } from '../placement';

@Render(
function(this: ChartDisplayComponent) {
	return html`
<div class$=${hidden(CurrentAppState().state !== AppState.DisplayChart)}>
<div id="chart">
	${this.chart != null ? this.chart.placements.map(p => html`
		<a href="javascript:void(0)" on-click=${() => this.current_placement = p}>
		<div class$="placement ${p.retrograde === true ? 'retrograde' : ''} ${p === this.current_placement ? 'selected' : ''} ${Element[Sign.GetElement(p.sign)].toLowerCase()}">
			<div class="planet">${Planet[p.planet]}</div>
			<div class="sign">${Sign[p.sign]}</div>
		</div>
		</a>
	`) : html``}
</div>
<div id="placement" class$=${hidden(this.current_placement == null)}>
	${(() => {
	let p = this.current_placement;
	if (p == null) {
		return html``;
	}
	return html`
	<div class="title">${Planet[p.planet]} in ${Sign[p.sign]} (${p.degrees.toFixed(1)}&deg;)</div>
	<div class$="retrograde ${hidden(p.retrograde === false)}">
		<span>Retrograde</span>
	</div>
	<div class$="element ${Element[Sign.GetElement(p.sign)].toLowerCase()}">
		<span>Element</span>
		<span>${Element[Sign.GetElement(p.sign)]}</span>
	</div>
	<div class$="quality ${Modality[Sign.GetModality(p.sign)].toLowerCase()}">
		<span>Modality</span>
		<span>${Modality[Sign.GetModality(p.sign)]}</span>
	</div>
	`})()}
</div>
</div>`;
})
export class ChartDisplayComponent implements RenderComponent {
	triggerRender: Subject<null>;

	@Bind chart: Chart | null;
	@Bind current_placement: Placement | null;

	constructor() {
		this.triggerRender = new Subject();
		OnAppStateChangeTo(DisplayChart)
			.subscribe(s => this.chart = s.chart);
	}

	reset() {
		this.chart = null;
		this.current_placement = null;
	}
}
