import { Planet } from './planet';
import { Sign } from './sign';

export class Placement {
	public planet: Planet;
	public sign: Sign;
	public degrees: number;

	constructor(planet: string, sign: string, degrees: number) {
		this.planet = (<any>Planet)[planet];
		this.sign = (<any>Sign)[sign];
		this.degrees = degrees;
	}

	public toString(): string {
		return `${Planet[this.planet]}: ${Sign[this.sign]}`;
	}
}
