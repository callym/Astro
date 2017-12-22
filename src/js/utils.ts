import { html, svg, TemplateResult } from './decorators/render';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/forkJoin';
import { App } from './models/app';

export function getID<T extends HTMLElement>(id: string): T {
	return document.getElementById(id) as T;
}

export function fetchDelay(request: Request): Promise<Response> {
	App.addLoading();
	return Observable.forkJoin(
		fetch(request),
		Observable.create((observer: Observer<null>) => {
			setTimeout(() => {
				observer.next(null);
				observer.complete();
			}, 1000);
		}),
	).toPromise()
	.then(ret => {
		App.removeLoading();
		return ret;
	})
	.then(ret => ret[0]);
}

export function icon(name: string, ...css: string[]): TemplateResult {
	return svg`
<svg class$="icon ${css.join(' ')}">
	<use href$="svg/sprite.svg#${name.toLowerCase()}"></use>
</svg>`;
}
