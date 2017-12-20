export enum Planet {
	Sun,
	Moon,
	Mercury,
	Venus,
	Mars,
	Jupiter,
	Saturn,
	Uranus,
	Neptune,
	Pluto,
};

export namespace Planet {
	export function GetSymbol(p: Planet): string {
		switch (p) {
			case Planet.Sun:
				return '☉';
			case Planet.Moon:
				return '☽';
			case Planet.Mercury:
				return '☿';
			case Planet.Venus:
				return '♀';
			case Planet.Mars:
				return '♂';
			case Planet.Jupiter:
				return '♃';
			case Planet.Saturn:
				return '♄';
			case Planet.Uranus:
				return '♅';
			case Planet.Neptune:
				return '♆';
			case Planet.Pluto:
				return '♇';
			default:
				throw 'Not a planet!';
		}
	}
}
