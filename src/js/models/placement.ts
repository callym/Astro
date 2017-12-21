import { Planet } from './planet';
import { Sign } from './sign';

export class Placement {
	public planet: Planet;
	public sign: Sign;
	public degrees: number;
	public retrograde: boolean;

	constructor(planet: string, sign: string, degrees: number, retrograde: boolean) {
		this.planet = (<any>Planet)[planet];
		this.sign = (<any>Sign)[sign];
		this.degrees = degrees;
		this.retrograde = retrograde;
	}
}
