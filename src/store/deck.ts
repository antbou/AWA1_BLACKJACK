import { defineStore } from "pinia";

interface Card {
  value: string | number;
  type: string;
  name: string;
  hidden: boolean;
}

export const useDeckStore = defineStore({
  id: "deck-store",
  state: () => ({
    deck: [] as Card[],
  }),
  actions: {
    buildDeck() {
      this.deck = [];

      // Card combinations:
      const values = [
        "ace",
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        "jack",
        "queen",
        "king",
      ];
      const types = ["clubs", "diamonds", "hearts", "spades"];

      //   Create a deck of cards
      types.forEach((type) => {
        values.forEach((value) => {
          this.deck.push({
            value: value,
            type: type,
            name: `${value}_of_${type}`, // A-C -> K-C, A-D -> K-D, etc.
            hidden: false,
          });
        });
      });
    },
    shuffleDeck() {
      // Shuffle the deck
      this.deck.sort(() => Math.random() - 0.5);
    },
    takeCard(): Card {
      // Take a card from the deck
      return this.deck.pop() as Card;
    },
    flipCard(card: Card) {
      // Flip a card
      card.hidden = false;
      return card;
    },
    hideCard(card: Card) {
      // Hide a card
      card.hidden = true;
      return card;
    },
  },
  getters: {
    getDeck: (state) => state.deck,
    getValue: () => {
      // Checks the value of the card and returns it as a number
      // Ace is returned as 11
      // Jack, Queen, and King are returned as 10
      return (card: Card) => {
        if (typeof card.value === "string") {
          if (card.value === "A") {
            return 11;
          }
          return 10;
        }
        return card.value;
      };
    },
    checkAce: () => {
      // Checks if the card is an ace and returns true/false
      return (card: Card) => {
        return card.value === "A";
      };
    },
  },
});
