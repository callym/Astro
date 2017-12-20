export enum Element {
	Fire,
	Water,
	Air,
	Earth,
};

export enum Modality {
	Cardinal,
	Fixed,
	Mutable,
};

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
}
