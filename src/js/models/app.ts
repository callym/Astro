import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import localForage from 'localforage';
import { Stack } from './stack';
import { AppState, AppStates, Home, SearchLocation } from './app_state';
import { app, App as RenderApp, RenderComponent } from '../decorators/render';

class AppClass {
	state: Stack<AppStates>;
	private components: Map<string, RenderComponent>;
	private appRef: RenderApp;
	private loading_count: number;

	constructor() {
		this.state = new Stack(new Home() as AppStates);
		this.components = new Map();
		this.appRef = app;
		this.loading_count = 0;

		localForage.config({
			name: 'callym.com-astro',
		});

		this.onStateChange().subscribe(() => this.appRef.render());
	}

	init(): Promise<null> {
		return this.appRef.init();
	}

	addLoading() {
		this.loading_count += 1;
		this.appRef.render();
	}

	removeLoading() {
		this.loading_count -= 1;
		if (this.loading_count < 0) {
			this.loading_count = 0;
		}
		this.appRef.render();
	}

	isLoading(): boolean {
		return this.loading_count > 0;
	}

	register<T extends RenderComponent>(...type: { new(): T ;}[]) {
		type.forEach(t => {
			this.components.set(t.prototype.constructor.name, new t());
		});
	}

	get<T extends RenderComponent>(type: { new(): T ;}): T | undefined {
		let component = this.components.get(type.prototype.constructor.name);

		if (component != null) {
			return component as T;
		}

		return component;
	}

	onStateChange(): Observable<AppStates> {
		return this.state.subscribe();
	}

	onStateChangeTo<T extends AppStates>(type: new(...args: any[]) => T): Observable<T> {
		function guard(value: AppStates): value is T {
			return Object.getPrototypeOf(value) === type.prototype;
		};

		return this.onStateChange()
			.filter(guard);
	}

	isState(state: AppState): boolean {
		if (this.isLoading() === true) {
			return false;
		}

		let current_state = this.state.peek();
		return current_state != null && current_state.state === state;
	}

	changeState(state: AppStates) {
		this.state.push(state);
	}

	resetState(state: AppStates): Promise<null> {
		this.state.empty(state);
		return this.appRef.reset();
	}

	getState(): AppStates {
		return this.state.peek();
	}
}

export let App = new AppClass();
