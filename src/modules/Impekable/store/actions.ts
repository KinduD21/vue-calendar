import type { CalendarStore, CalendarEvent } from "./types";

export default {
  addEvent(this: CalendarStore, event: Omit<CalendarEvent, "id">) {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    };

    this.events.push(newEvent);
  },

  updateEvent(this: CalendarStore, id: string, updates: Partial<CalendarEvent>) {
    const index = this.events.findIndex((event) => event.id === id);

    if (index !== -1) {
      this.events[index] = { ...this.events[index], ...updates };
    }
  },

  deleteEvent(this: CalendarStore, id: string) {
    const index = this.events.findIndex((event) => event.id === id);

    if (index !== -1) {
      this.events.splice(index, 1);
    }
  },

  getEventById(this: CalendarStore, id: string): CalendarEvent | undefined {
    return this.events.find((event) => event.id === id);
  },
};
