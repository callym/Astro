import { hidden, html, Render, RenderComponent } from '../decorators/render';
import { Subject } from 'rxjs/Subject';

import { App } from '../models/app';
import { Element } from '../models/sign';

@Render(
function(this: LoadingComponent) {
	return html`
<div id="loading" class$=${hidden(App.isLoading() === false)}>
	<div class="spinner">
		<span class="air">${Element.GetSymbol(Element.Air)}</span>
		<span class="water">${Element.GetSymbol(Element.Water)}</span>
		<span class="fire">${Element.GetSymbol(Element.Fire)}</span>
		<span class="earth">${Element.GetSymbol(Element.Earth)}</span>
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
