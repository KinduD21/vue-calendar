<template>
  <URow block gap="none">
    <AsideBlock />

    <UCol block gap="none" class="bg-[#f0f0f7]">
      <PageHeader />

      <UHeader :label="t('title.calendar')" size="lg" class="pt-10 px-20" />

      <UPage variant="soft" :config="{ page: '!rounded-none' }" class="py-10 px-20">
        <CalendarHeader
          :calendar-title="calendarTitle"
          @change-view="changeView"
          @go-to-view="goToView"
        />

        <div
          ref="calendarContainer"
          v-click-outside="[closePopup, clickOutsideOptions]"
          class="relative"
        >
          <FullCalendar ref="calendar" :options="calendarOptions" />

          <CalendarPopup
            :show="showPopup"
            :position="popupPosition"
            :is-editing="isEditing"
            :event-data="editingEventData || undefined"
            :selected-date="selectedDate"
            :selected-time="selectedTime"
            @close="closePopup"
            @save="saveEvent"
            @delete="deleteEvent"
          />
        </div>
      </UPage>
    </UCol>
  </URow>
</template>

<script setup lang="ts">
import { ref, computed, useTemplateRef, nextTick } from "vue";
import { useModuleI18n } from "../composables/useI18n";

import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import AsideBlock from "../components/AsideBlock.vue";
import PageHeader from "../components/PageHeader.vue";
import CalendarPopup from "../components/CalendarPopup.vue";
import CalendarHeader from "../components/CalendarHeader.vue";

import { useCalendarStore } from "../store";
import { vClickOutside } from "vueless";

import type { DayHeaderContentArg } from "@fullcalendar/core";
import type {
  SelectInfo,
  EventClickInfo,
  EventDropInfo,
  EventResizeInfo,
  EventData,
} from "../types";

const { t } = useModuleI18n();

const calendarStore = useCalendarStore();
const calendarRef = useTemplateRef("calendar");
const calendarContainerRef = useTemplateRef("calendarContainer");
const showPopup = ref(false);
const isEditing = ref(false);
const currentView = ref("Month");
const selectedDate = ref("");
const selectedTime = ref("");
const editingEventId = ref("");
const editingEventData = ref<EventData | null>(null);
const popupPosition = ref({ top: 0, left: 0 });

const clickOutsideOptions = ref({
  ignore: [calendarContainerRef],
});

const transformedEvents = computed(() => {
  return calendarStore.events.map((event) => ({
    ...event,
    start: event.time ? `${event.start}T${event.time}:00` : event.start,
  }));
});

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  initialDate: "2025-09-01",
  headerToolbar: false as const,
  events: transformedEvents.value,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  allDayText: "all day",
  views: {
    timeGridWeek: {
      dayHeaderContent: (arg: DayHeaderContentArg) => {
        const d = arg.date;
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const weekday = d.toLocaleDateString("en-US", { weekday: "short" });

        return `${weekday} ${day}/${month}`;
      },
      titleFormat: { month: "short" as const, day: "numeric" as const },
    },
    timeGridDay: {
      dayHeaderContent: (arg: DayHeaderContentArg) => {
        const d = arg.date;
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const weekday = d.toLocaleDateString("en-US", { weekday: "short" });

        return `${weekday} ${day}/${month}`;
      },
      titleFormat: { weekday: "long" as const, month: "short" as const, day: "numeric" as const },
    },
  },
  slotLabelFormat: {
    hour: "numeric" as const,
    minute: "2-digit" as const,
    hour12: true,
    meridiem: "short" as const,
  },
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventDrop: handleEventDrop,
  eventResize: handleEventResize,
  datesSet: updateCalendarTitle,
}));

const calendarTitle = ref("September 2025");

function calculatePopupPositionForEvent(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const containerRect = calendarContainerRef.value?.getBoundingClientRect();

  if (!containerRect) return { top: 0, left: 0 };

  const top = rect.bottom - containerRect.top + 8;
  const left = rect.left - containerRect.left + rect.width / 2 - 150;

  return {
    top,
    left: Math.max(10, Math.min(left, containerRect.width)),
  };
}

async function handleDateSelect(selectInfo: SelectInfo) {
  if (showPopup.value) closePopup();

  await nextTick();

  const mouseEvent = selectInfo.jsEvent;

  if (mouseEvent && calendarContainerRef.value) {
    const containerRect = calendarContainerRef.value.getBoundingClientRect();

    const relativeY = mouseEvent.clientY - containerRect.top;
    const relativeX = mouseEvent.clientX - containerRect.left;

    popupPosition.value = {
      top: relativeY + 10,
      left: Math.max(10, Math.min(relativeX - 150, containerRect.width - 320)),
    };
  }

  const startDate = selectInfo.start;

  const year = startDate.getFullYear();
  const month = String(startDate.getMonth() + 1).padStart(2, "0");
  const day = String(startDate.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;

  const hours = startDate.getHours();
  const minutes = startDate.getMinutes();
  const timeStr =
    hours !== 0 || minutes !== 0
      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
      : "";

  selectedDate.value = dateStr;
  selectedTime.value = timeStr;
  editingEventData.value = null;
  isEditing.value = false;
  showPopup.value = true;
}

async function handleEventClick(clickInfo: EventClickInfo) {
  if (showPopup.value) closePopup();

  await nextTick();

  const event = calendarStore.getEventById(clickInfo.event.id);
  const eventElement = clickInfo.el;

  if (eventElement) {
    popupPosition.value = calculatePopupPositionForEvent(eventElement);
  }

  if (event) {
    editingEventId.value = event.id;
    editingEventData.value = event;
    isEditing.value = true;
    showPopup.value = true;
  }
}

function handleEventDrop(dropInfo: EventDropInfo) {
  const eventId = dropInfo.event.id;
  const startDate = dropInfo.event.start;

  if (startDate) {
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, "0");
    const day = String(startDate.getDate()).padStart(2, "0");

    const hours = startDate.getHours();
    const minutes = startDate.getMinutes();

    if (hours !== 0 || minutes !== 0) {
      const timeString = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      const newStart = `${year}-${month}-${day}`;

      calendarStore.updateEvent(eventId, {
        start: newStart,
        time: timeString,
        allDay: false,
      });
    } else {
      const newStart = `${year}-${month}-${day}`;

      calendarStore.updateEvent(eventId, {
        start: newStart,
        time: undefined,
        allDay: true,
      });
    }
  }
}

function handleEventResize(resizeInfo: EventResizeInfo) {
  const eventId = resizeInfo.event.id;
  const endDate = resizeInfo.event.end;

  if (endDate) {
    const year = endDate.getFullYear();
    const month = String(endDate.getMonth() + 1).padStart(2, "0");
    const day = String(endDate.getDate()).padStart(2, "0");
    const newEnd = `${year}-${month}-${day}`;

    calendarStore.updateEvent(eventId, { end: newEnd });
  }
}

function updateCalendarTitle() {
  if (calendarRef.value) {
    const api = calendarRef.value.getApi();

    calendarTitle.value = api.view.title;
  }
}

function saveEvent(eventData: EventData) {
  if (isEditing.value) {
    calendarStore.updateEvent(editingEventId.value, eventData);
  } else {
    calendarStore.addEvent(eventData);
  }

  closePopup();
}

function deleteEvent(eventId: string) {
  calendarStore.deleteEvent(eventId);
  closePopup();
}

function closePopup() {
  showPopup.value = false;
  isEditing.value = false;
  editingEventId.value = "";
  editingEventData.value = null;
  selectedTime.value = "";
}

function changeView(view: string) {
  currentView.value = view;

  if (calendarRef.value) {
    const api = calendarRef.value.getApi();

    switch (view) {
      case "month":
        api.changeView("dayGridMonth");
        break;
      case "week":
        api.changeView("timeGridWeek");
        break;
      case "day":
        api.changeView("timeGridDay");
        break;
    }
  }
}

function goToToday() {
  if (calendarRef.value) {
    calendarRef.value.getApi().today();
  }
}

function goToPrevious() {
  if (calendarRef.value) {
    calendarRef.value.getApi().prev();
  }
}

function goToNext() {
  if (calendarRef.value) {
    calendarRef.value.getApi().next();
  }
}

function goToView(value: string) {
  if (value === "today") goToToday();

  if (value === "back") {
    goToPrevious();
  }

  if (value === "next") {
    goToNext();
  }
}
</script>
