<template>
  <div>
    <URow block justify="between" align="center" class="mb-5">
      <UHeader :label="t('label.calendarView')" />

      <UToggle
        v-model="selectedViewButton"
        name="view"
        :options="viewOptions"
        :config="toggleConfig"
        @update:model-value="changeView"
      />
    </URow>

    <URow block justify="between" align="center" class="mb-5">
      <UToggle
        v-model="selectedControlButton"
        name="controls"
        :options="controlOptions"
        :config="toggleConfig"
        @update:model-value="goToView"
      />

      <UHeader :label="calendarTitle" />

      <div class="min-w-[245px]" />
    </URow>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import { useModuleI18n } from "../composables/useI18n";

import type { CalendarHeaderProps, CalendarHeaderEmits } from "../types";

const { t } = useModuleI18n();

const toggleConfig = /*tw*/ {
  options: "!p-0 shadow",
  divider: "my-0",
  dividerHidden: "border-muted",
  toggleButton: "rounded-none first:rounded-l-medium last:rounded-r-medium -mx-px",
  toggleButtonActive: "!bg-transparent text-info hover:text-info-accented",
};

defineProps<CalendarHeaderProps>();

const emit = defineEmits<CalendarHeaderEmits>();

const selectedViewButton = ref("month");
const viewOptions = computed(() => [
  { label: t("label.month"), value: "month", disabled: false },
  { label: t("label.week"), value: "week", disabled: false },
  { label: t("label.day"), value: "day", disabled: false },
  { label: t("label.agenda"), value: "agenda", disabled: true },
]);

const selectedControlButton = ref("today");
const controlOptions = computed(() => [
  { label: t("label.today"), value: "today" },
  { label: t("label.back"), value: "back" },
  { label: t("label.next"), value: "next" },
]);

function changeView(view: string) {
  emit("changeView", view);
}

function goToView(value: string) {
  emit("goToView", value);

  if (value === "back" || value === "next") {
    selectedControlButton.value = "";
  }
}
</script>
