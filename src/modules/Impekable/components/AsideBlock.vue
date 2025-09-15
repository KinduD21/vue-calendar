<template>
  <UCol class="bg-[#43425d] fixed left-0 top-0 h-screen w-[300px] z-10">
    <UHeader
      label="impekable"
      size="xs"
      class="uppercase tracking-widest text-inverted bg-[#3a3a52] py-8 px-5 min-w-[300px]"
    />

    <ul class="flex flex-col gap-2 w-full">
      <li v-for="item in menuItems" :key="item.label">
        <UButton
          :label="item.label"
          :left-icon="item.leftIcon"
          variant="ghost"
          color="grayscale"
          block
          :disabled="!item.active"
          class="justify-start text-inverted hover:text-inverted disabled:!text-inverted/75 rounded-none py-5 items-end gap-2"
          :class="{
            'bg-[#3a3a52] hover:bg-[#3a3a52] active:text-inverted active:bg-[#3a3a52] border-l-4 border-l-[#a3a0fb]':
              item.active,
          }"
          :config="getButtonConfig(item.active ?? false)"
        />
      </li>
    </ul>
  </UCol>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { useModuleI18n } from "../composables/useI18n";

const { t } = useModuleI18n();

function getButtonConfig(active: boolean) {
  return active ? { leftIcon: "text-[#a3a0fb]" } : {};
}

const menuItems = computed(() => [
  { label: t("label.home"), leftIcon: "home" },
  { label: t("label.dashboard"), leftIcon: "bar_chart" },
  { label: t("label.inbox"), leftIcon: "mail" },
  { label: t("label.products"), leftIcon: "barcode" },
  { label: t("label.invoices"), leftIcon: "receipt" },
  { label: t("label.customers"), leftIcon: "person" },
  { label: t("label.chatRoom"), leftIcon: "chat" },
  { label: t("label.calendar"), leftIcon: "calendar_month", active: true },
  { label: t("label.helpCenter"), leftIcon: "help_center" },
  { label: t("label.settings"), leftIcon: "settings" },
]);
</script>
