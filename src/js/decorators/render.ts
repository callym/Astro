import { html, render } from 'lit-html/lib/lit-extended';
export { html } from 'lit-html/lib/lit-extended';
import { TemplateResult } from 'lit-html';
export { TemplateResult } from 'lit-html';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as Utils from '../utils';

export function hidden(val: boolean): string {
	return val === true ? 'hidden' : '';
}

export interface RenderComponent {
	reset(): void;
	init?(): void;
	triggerRender: Subject<null>;
}

interface RenderComponentData extends RenderComponent {
	render(): TemplateResult;
}

interface Registered {
	element: HTMLElement;
}

export class App {
	private container: HTMLElement;
	private renderables: Map<string, RenderComponentData & Registered>;

	constructor() {
		this.container = Utils.getID('app_container');
		this.renderables = new Map();
	}

	register(name: string, data: RenderComponentData) {
		let el = document.createElement('div');
		el.id = name;

		this.container.appendChild(el);

		this.renderables.set(name, { ...data, element: el });

		this.render(name);

		if (data.init != null) {
			data.init();
		}

		data.triggerRender.subscribe(() => this.render(name));
	}

	unregister(name: string) {
		this.renderables.delete(name);

		this.render();
	}

	private doRender(r: RenderComponentData & Registered) {
		render(r.render(), r.element);
	}

	render(name?: string) {
		if (name != null) {
			let r = this.renderables.get(name);
			if (r == null) {
				return;
			}

			return this.doRender(r);
		}

		[...this.renderables.values()].forEach(r => this.doRender(r));
	}

	reset(name?: string) {
		if (name != null) {
			let r = this.renderables.get(name);
			if (r == null) {
				return;
			}

			r.reset();

			return this.render(name);
		}

		[...this.renderables.values()].forEach(r => r.reset());
		this.render();
	}
}

export let app = new App();

export function Render(html: () => TemplateResult) {
	return function<T extends { new(...args: any[]): RenderComponent }>(target: T) {
		const result = class extends target {
			public name: string;

			constructor(...args: any[]) {
				super(...args);

				let reset = this.reset.bind(this);

				let init = this.init;
				if (init != null) {
					init = init.bind(this);
				}

				html = html.bind(this);

				this.name = target.prototype.constructor.name;

				app.register(this.name, {
					init,
					reset,
					render: html,
					triggerRender: this.triggerRender,
				});
			}
		};

		result.prototype = target.prototype;
		return result;
	};
}
