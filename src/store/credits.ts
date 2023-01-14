import { defineStore } from "pinia";

export const useCreditStore = defineStore({
  id: "credit-store",
  state: () => ({
    credits: 500,
  }),
  actions: {
    resetCredits() {
      this.credits = 500;
    },
    addCredits(amount: number) {
      this.credits += amount;
    },
    subtractCredits(amount: number) {
      this.credits -= amount;
    },
  },
  getters: {
    getCredits: (state) => state.credits,
  },
});
