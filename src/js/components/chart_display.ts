import { hidden, html, Render, RenderComponent } from '../decorators/render';
import { Bind } from '../decorators/bind';
import { icon } from '../utils';
import { Subject } from 'rxjs/Subject';
import Clipboard from 'clipboard';
import localForage from 'localforage';

import { Chart } from '../models/chart';
import { Placement } from '../models/placement';
import { Planet } from '../models/planet';
import { Sign, Element, Modality } from '../models/sign';

import { App } from '../models/app';
import { AppState, DisplayChart } from '../models/app_state';

@Render('ChartDisplayComponent',
function(this: ChartDisplayComponent) {
	return html`
<div class$=${hidden(App.isState(AppState.DisplayChart) === false)}>
<div id="chart-header">
	${this.chart != null ? html`
	<button class="save" on-click="${(e: Event) => this.save(e)}"
		data-balloon="saved!" data-balloon-pos="down" data-balloon-visible$="${this.has_saved}">
		save ${icon('symbol--save')}
	</button>
	<div class="title">
		<h1>${this.chart.name}</h1>
		<h2>${this.chart.display_date}</h2>
		<h3>${this.chart.location.address}</h3>
	</div>
	<button class="share" data-clipboard-text$="${this.chart_url}"
		data-balloon="copied link to clipboard!" data-balloon-pos="down" data-balloon-visible$="${this.has_shared}">
		share ${icon('symbol--share')}
	</button>
	` : html``}
</div>
<div id="chart">
	${this.chart != null ? [...this.chart.placements.values()].map(p => html`
		<a href="javascript:void(0)" on-click=${() => this.current_placement = p}>
		<div class$="placement ${p === this.current_placement ? 'selected' : ''} ${Element[Sign.GetElement(p.sign)].toLowerCase()}">
			<div class="planet-symbol">${icon(`planet--${Planet[p.planet]}`)}</div>
			<div class="planet" text$="${Planet[p.planet]}">${Planet[p.planet]}</div>
			<div class="retrograde">${p.retrograde === true ? icon('symbol--retrograde') : ''}</div>
			<div class="sign" text$="${Sign[p.sign]}">${Sign[p.sign]}</div>
			<div class="sign-symbol">${icon(`sign--${Sign[p.sign]}`)}</div>
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
	<div class$="retrograde ${hidden(p.retrograde === false)}">${icon('symbol--retrograde')}etrograde</div>
	<div class$="element-row ${Element[Sign.GetElement(p.sign)].toLowerCase()}">
		<span class="element-title">Element</span>
		<span class="element-symbol">${icon(`element--${Element[Sign.GetElement(p.sign)]}`)}</span>
		<span class="element">${Element[Sign.GetElement(p.sign)]}</span>
	</div>
	<div class$="modality-row ${Modality[Sign.GetModality(p.sign)].toLowerCase()}">
		<span class="modality-title">Modality</span>
		<span class="modality-symbol">${icon(`modality--${Modality[Sign.GetModality(p.sign)]}`)}</span>
		<span class="modality">${Modality[Sign.GetModality(p.sign)]}</span>
	</div>
	`})()}
</div>
</div>`;
})
export class ChartDisplayComponent implements RenderComponent {
	triggerRender: Subject<null>;

	@Bind chart: Chart | null;
	@Bind current_placement: Placement | null;
	@Bind chart_url: string;

	@Bind has_saved: boolean;
	@Bind has_shared: boolean;

	constructor() {
		this.triggerRender = new Subject();
		App.onStateChangeTo(DisplayChart)
			.subscribe(s => {
				this.chart = s.chart;

				let params = new URLSearchParams();
				params.set('name', this.chart.name);
				params.set('location', JSON.stringify(this.chart.location));
				params.set('date', this.chart.date.toISOString());
				params.set('display_date', this.chart.display_date);
				this.chart_url = `${location.origin}${location.pathname}?${params}`;
			});
	}

	init() {
		let share = new Clipboard('.share');

		share.on('success', () => {
			this.has_shared = true;
			setTimeout(() => this.has_shared = false, 1000);
		});
	}

	reset() {
		this.chart = null;
		this.chart_url = '';
		this.current_placement = null;

		this.has_saved = false;
		this.has_shared = false;
	}

	save(e: Event) {
		e.preventDefault();

		if (this.chart == null) {
			return;
		}

		localForage.setItem(this.chart.name, this.chart)
			.then(() => {
				this.has_saved = true;
				setTimeout(() => this.has_saved = false, 1000);
			});
	}
}
