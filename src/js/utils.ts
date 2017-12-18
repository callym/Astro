export function getID<T extends HTMLElement>(id: string): T {
	return document.getElementById(id) as T;
}
