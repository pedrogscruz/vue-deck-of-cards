export type pile = {
	value: string;
	suit: string;
	code: string;
}

export type card = Omit<pile, 'code'>

export type deckCard = {
	text: string;
	valid: boolean;
	repeated: boolean
};

export type deck = {
	cards: string[];
	fullHouse: string[][];
	rotationCard: string
};

export type getDeckResponse = {
	piles: {
		my_pile: {
			cards: card[]
		}
	}
};