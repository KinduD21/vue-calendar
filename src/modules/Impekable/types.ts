export interface SelectInfo {
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
  jsEvent: MouseEvent | null;
  view: unknown;
}

export interface EventClickInfo {
  event: {
    id: string;
    title: string;
    start: Date | null;
    end?: Date | null;
  };
  el: HTMLElement;
  jsEvent: MouseEvent;
  view: unknown;
}

export interface EventDropInfo {
  event: {
    id: string;
    start: Date | null;
    end?: Date | null;
  };
  oldEvent: unknown;
  delta: unknown;
  revert: () => void;
  jsEvent: MouseEvent;
  view: unknown;
}

export interface EventResizeInfo {
  event: {
    id: string;
    start: Date | null;
    end?: Date | null;
  };
  oldEvent: unknown;
  startDelta: unknown;
  endDelta: unknown;
  revert: () => void;
  jsEvent: MouseEvent;
  view: unknown;
}

export interface EventData {
  id?: string;
  title: string;
  start: string;
  time?: string;
  notes?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export interface EventDataForSave {
  title: string;
  start: string;
  time?: string;
  notes?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export interface CalendarPopupProps {
  show: boolean;
  position: { top: number; left: number };
  isEditing: boolean;
  eventData?: EventData;
  selectedDate: string;
  selectedTime?: string;
}

export interface CalendarPopupEmits {
  (e: "close"): void;
  (e: "save", data: EventDataForSave): void;
  (e: "delete", id: string): void;
}

export interface CalendarHeaderProps {
  calendarTitle: string;
}

export interface CalendarHeaderEmits {
  changeView: [view: string];
  goToView: [value: string];
}
