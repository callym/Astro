export enum Element {
	Fire,
	Water,
	Air,
	Earth,
};

export namespace Element {
	export function GetSymbol(e: Element): string {
		switch(e) {
			case Element.Fire:
				return '🜂';
			case Element.Water:
				return '🜄';
			case Element.Air:
				return '🜁';
			case Element.Earth:
				return '🜃';
			default:
				throw 'Not an element!';
		}
	}
}

export enum Modality {
	Cardinal,
	Fixed,
	Mutable,
};

export namespace Modality {
	export function GetSymbol(m: Modality): string {
		switch (m) {
			case Modality.Cardinal:
				return '🜍';
			case Modality.Fixed:
				return '🜔';
			case Modality.Mutable:
				return '☿';
			default:
				throw 'Not a modality';
		}
	}
}

export enum Sign {
	Aries,
	Taurus,
	Gemini,
	Cancer,
	Leo,
	Virgo,
	Libra,
	Scorpio,
	Sagittarius,
	Capricorn,
	Aquarius,
	Pisces,
};

export namespace Sign {
	export function GetElement(sign: Sign): Element {
		switch (sign) {
			case Sign.Aries:
			case Sign.Leo:
			case Sign.Sagittarius:
				return Element.Fire;
			case Sign.Taurus:
			case Sign.Virgo:
			case Sign.Capricorn:
				return Element.Earth;
			case Sign.Gemini:
			case Sign.Libra:
			case Sign.Aquarius:
				return Element.Air;
			case Sign.Cancer:
			case Sign.Scorpio:
			case Sign.Pisces:
				return Element.Water;
			default:
				throw 'Not a sign!'
		}
	}

	export function GetModality(sign: Sign): Modality {
		switch (sign) {
			case Sign.Aries:
			case Sign.Cancer:
			case Sign.Libra:
			case Sign.Capricorn:
				return Modality.Cardinal;
			case Sign.Taurus:
			case Sign.Leo:
			case Sign.Scorpio:
			case Sign.Aquarius:
				return Modality.Fixed;
			case Sign.Gemini:
			case Sign.Virgo:
			case Sign.Sagittarius:
			case Sign.Pisces:
				return Modality.Mutable;
			default:
				throw 'Not a sign!'
		}
	}

	export function GetSymbol(sign: Sign): string {
		switch (sign) {
			case Sign.Aries:
				return '♈';
			case Sign.Taurus:
				return '♉'
			case Sign.Gemini:
				return '♊';
			case Sign.Cancer:
				return '♋';
			case Sign.Leo:
				return '♌';
			case Sign.Virgo:
				return '♍';
			case Sign.Libra:
				return '♎';
			case Sign.Scorpio:
				return '♏';
			case Sign.Sagittarius:
				return '♐';
			case Sign.Capricorn:
				return '♑';
			case Sign.Aquarius:
				return '♒';
			case Sign.Pisces:
				return '♓';
			default:
				throw 'Not a sign!'
		}
	}
}
