import { defineStore } from "pinia";

export type ColorVariants =
  | "light"
  | "red"
  | "green"
  | "blue"
  | "dark"
  | "purple";

export type Token = {
  value: number;
  variant: ColorVariants;
  border?: ColorVariants;
};

export const useTokenStore = defineStore({
  id: "token-store",
  state: () => ({
    tokens: [
      { value: 1, variant: "light", border: "info" },
      { value: 5, variant: "red" },
      { value: 25, variant: "green" },
      { value: 50, variant: "blue" },
      { value: 100, variant: "dark" },
      { value: 500, variant: "purple" },
    ] as Token[],
    colors: {
      light: "#FFFFFF",
      red: "#AE0F28",
      green: "#00A333",
      blue: "#6D7C8A",
      dark: "#17232E",
      purple: "#75498F",
      gold: "#E6AE03",
    },
    tokensPlayed: [] as Token[],
  }),
  actions: {
    addTokenPlayed(token: Token) {
      this.tokensPlayed.push(token);
    },
    removeTokenPlayed(token: Token) {
      this.tokensPlayed = this.tokensPlayed.filter(
        (t) => t.value !== token.value
      );
    },
  },
  getters: {
    all(state) {
      return state.tokens;
    },
    token: (state) => (value: number) =>
      state.tokens.filter((t) => t.value === value).pop(),
    tokenColor: (state) => (variant: ColorVariants) => state.colors[variant],
    allTokensPlayed(state) {
      return state.tokensPlayed;
    },
  },
});
