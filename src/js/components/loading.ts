import { hidden, html, Render, RenderComponent } from '../decorators/render';
import { icon } from '../utils';
import { Subject } from 'rxjs/Subject';

import { App } from '../models/app';
import { Element } from '../models/sign';

@Render(
function(this: LoadingComponent) {
	return html`
<div id="loading" class$=${hidden(App.isLoading() === false)}>
	<div class="spinner">
		<span class="air">${icon('element--air')}</span>
		<span class="water">${icon('element--water')}</span>
		<span class="fire">${icon('element--fire')}</span>
		<span class="earth">${icon('element--earth')}</span>
	</div>
</div>`;
})
export class LoadingComponent implements RenderComponent {
	triggerRender: Subject<null>;

	constructor() {
		this.triggerRender = new Subject();
	}

	reset() { }
}
