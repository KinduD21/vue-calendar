<template>
  <UCard
    v-if="show"
    :style="popupStyle"
    class="event-popup absolute bg-white !px-5 !pt-10 !pb-5 w-80 border border-black rounded-large"
    @click.stop
  >
    <UIcon
      name="cancel"
      interactive
      color="neutral"
      size="lg"
      class="absolute top-2 right-2 opacity-75"
      @click="closePopup"
    />

    <UCol block>
      <UInput
        v-model="eventForm.title"
        type="text"
        :placeholder="t('placeholder.eventName')"
        :error="titleError"
        max-length="30"
        :config="inputConfig"
      />

      <UDatePicker
        v-model="eventForm.date"
        :error="dateError"
        :config="{ datepickerInput: { ...inputConfig } }"
        user-date-format="d/m/Y"
        class="w-full"
      />

      <input
        v-model="eventForm.time"
        type="time"
        class="w-full py-2 pl-3 pr-2 border-b border-b-default"
      />

      <UInput
        v-model="eventForm.notes"
        :placeholder="t('placeholder.notes')"
        type="text"
        max-length="30"
        :config="inputConfig"
      />

      <ULabel :label="t('label.selectAColor')">
        <UColorPicker v-model="selectedColor" :colors="colors" />
      </ULabel>

      <URow block justify="between" class="mt-5">
        <UButton
          v-if="!isEditing"
          :label="t('label.cancel')"
          color="error"
          variant="ghost"
          @click="closePopup"
        />

        <UButton
          v-if="isEditing"
          :label="t('label.discard')"
          color="error"
          variant="ghost"
          @click="deleteEvent"
        />

        <UButton
          :label="isEditing ? t('label.edit') : t('label.save')"
          variant="ghost"
          @click="saveEvent"
        />
      </URow>
    </UCol>
  </UCard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

import { useValidation } from "../composables/useValidation";

import { getHexColor } from "@/utils/helper";

import type { CalendarPopupProps, CalendarPopupEmits } from "../types";

const props = defineProps<CalendarPopupProps>();

const emit = defineEmits<CalendarPopupEmits>();

const inputConfig = /*tw*/ {
  wrapper: {
    base: `
      rounded-none border-transparent border-b border-b-default
      focus-within:border-transparent focus-within:outline-none
      hover:border-transparent hover:focus-within:border-transparent
      hover:border-b-default focus-within:border-b-default hover:focus-within:border-b-default
    `,
    variants: {
      error: {
        true: "!border-transparent !border-b-error focus-within:outline-none",
      },
    },
  },
};

const eventForm = ref({
  title: "",
  date: "" as string | Date,
  time: "",
  notes: "",
  color: "",
});

const selectedColor = ref("blue");

const colors = {
  grayscale: "bg-grayscale",
  neutral: "bg-neutral-600 dark:bg-neutral-400",
  red: "bg-red-600 dark:bg-red-400",
  orange: "bg-orange-600 dark:bg-orange-400",
  amber: "bg-amber-600 dark:bg-amber-400",
  yellow: "bg-yellow-600 dark:bg-yellow-400",
  lime: "bg-lime-600 dark:bg-lime-400",
  green: "bg-green-600 dark:bg-green-400",
  emerald: "bg-emerald-600 dark:bg-emerald-400",
  teal: "bg-teal-600 dark:bg-teal-400",
  cyan: "bg-cyan-600 dark:bg-cyan-400",
  sky: "bg-sky-600 dark:bg-sky-400",
  blue: "bg-blue-600 dark:bg-blue-400",
  indigo: "bg-indigo-600 dark:bg-indigo-400",
  violet: "bg-violet-600 dark:bg-violet-400",
  purple: "bg-purple-600 dark:bg-purple-400",
  fuchsia: "bg-fuchsia-600 dark:bg-fuchsia-400",
  pink: "bg-pink-600 dark:bg-pink-400",
  rose: "bg-rose-600 dark:bg-rose-400",
};

const colorHexMap = {
  grayscale: "#6b7280",
  neutral: "#525252",
  red: "#dc2626",
  orange: "#ea580c",
  amber: "#d97706",
  yellow: "#ca8a04",
  lime: "#65a30d",
  green: "#16a34a",
  emerald: "#059669",
  teal: "#0d9488",
  cyan: "#0891b2",
  sky: "#0284c7",
  blue: "#2563eb",
  indigo: "#4f46e5",
  violet: "#7c3aed",
  purple: "#9333ea",
  fuchsia: "#c026d3",
  pink: "#db2777",
  rose: "#e11d48",
};

const { titleError, dateError, validate, t } = useValidation(eventForm);

const popupStyle = computed(() => ({
  position: "absolute",
  top: `${props.position.top}px`,
  left: `${props.position.left}px`,
  zIndex: 1000,
}));

function resetForm() {
  eventForm.value.title = "";
  eventForm.value.date = props.selectedDate;
  eventForm.value.time = props.selectedTime || "";
  eventForm.value.notes = "";
  eventForm.value.color = "";
  selectedColor.value = "blue";
}

function saveEvent() {
  if (!validate()) return;

  const hexColor = getHexColor(colorHexMap, selectedColor.value);

  let startDate = eventForm.value.date;

  if (startDate instanceof Date) {
    startDate = startDate.toISOString().split("T")[0];
  } else if (typeof startDate === "string" && !eventForm.value.time && startDate.includes("T")) {
    startDate = startDate.split("T")[0];
  }

  const eventData = {
    title: eventForm.value.title,
    start: startDate,
    time: eventForm.value.time || undefined,
    notes: eventForm.value.notes,
    color: selectedColor.value,
    backgroundColor: hexColor,
    borderColor: hexColor,
  };

  emit("save", eventData);
}

function deleteEvent() {
  if (props.eventData?.id) {
    emit("delete", props.eventData.id);
  }
}

function closePopup() {
  emit("close");
}

watch(
  () => props.eventData,
  (newEventData) => {
    if (newEventData) {
      eventForm.value.title = newEventData.title;

      if (newEventData.time) {
        eventForm.value.date = newEventData.start;
        eventForm.value.time = newEventData.time;
      } else {
        const startParts = newEventData.start.split("T");

        eventForm.value.date = startParts[0];
        eventForm.value.time = startParts[1] ? startParts[1].substring(0, 5) : "";
      }

      eventForm.value.notes = newEventData.notes || "";
      eventForm.value.color = newEventData.color || "";
      selectedColor.value = newEventData.color || "blue";
    } else {
      resetForm();
    }
  },
  { immediate: true },
);

watch(
  () => props.selectedDate,
  (newDate) => {
    if (!props.isEditing) eventForm.value.date = newDate;
  },
);

watch(
  () => props.selectedTime,
  (newTime) => {
    if (!props.isEditing) eventForm.value.time = newTime || "";
  },
);

watch(
  () => props.show,
  (isShowing) => {
    if (isShowing && !props.isEditing) resetForm();
  },
);
</script>
