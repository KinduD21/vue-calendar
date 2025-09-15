export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  notes?: string;
  color?: string;
  time?: string;
}

export interface CalendarStore {
  $patch: (partialState: Partial<CalendarState>) => void;
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => CalendarEvent | undefined;
}

export interface CalendarState {
  events: CalendarEvent[];
}
