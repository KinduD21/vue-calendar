import { defineStore } from "pinia";

import actions from "./actions";
import getters from "./getters";
import type { CalendarState } from "./types";

export const useCalendarStore = defineStore("Calendar", {
  state: (): CalendarState => ({
    events: [
      {
        id: "1",
        title: "Interview",
        start: "2025-09-16",
        notes: "take my PC with me",
        color: "sky",
      },
      {
        id: "2",
        title: "Book a flight",
        start: "2025-09-10",
        color: "teal",
      },
      {
        id: "3",
        title: "Check tickets",
        start: "2025-09-25",
        color: "purple",
      },
    ],
  }),
  actions,
  getters,
});
