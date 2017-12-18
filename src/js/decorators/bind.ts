import { RenderComponent } from './render';

export function Bind<T extends RenderComponent>(target: T, key: string) {
	let value = (<any>target)[key];

	let getter = function() {
		return value;
	};

	let setter = function(this: T, v: any) {
		value = v;
		if (this.triggerRender != null) {
			this.triggerRender.next(null);
		}
	};

	Object.defineProperty(target, key, {
		get: getter,
		set: setter,
	});
}
