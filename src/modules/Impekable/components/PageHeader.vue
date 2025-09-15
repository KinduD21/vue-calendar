<template>
  <URow gap="none" block>
    <UInputSearch
      :placeholder="t('placeholder.search')"
      size="lg"
      left-icon="search"
      :config="searchInputConfig"
    >
      <template #right>
        <URow align="center" gap="lg">
          <UIcon name="help" color="neutral" interactive />
          <UIcon name="chat-fill" color="neutral" interactive />
          <UChip :config="{ chipDot: 'bg-yellow-400' }">
            <UIcon name="notifications-fill" color="neutral" interactive />
          </UChip>

          <UDivider vertical class="h-10" />

          <UDropdownLink label="John Doe" class="w-max" />

          <UAvatar src="https://i.pravatar.cc/150?img=68" rounded="full" />
        </URow>
      </template>
    </UInputSearch>
  </URow>
</template>

<script setup lang="ts">
import { useModuleI18n } from "../composables/useI18n";

const { t } = useModuleI18n();

const searchInputConfig = /*tw*/ {
  searchInput: {
    wrapper: `
      px-5 rounded-none shadow border-transparent
      focus-within:border-transparent focus-within:outline-none
      hover:border-transparent hover:focus-within:border-transparent
    `,
    input: "py-[30px]",
  },
};
</script>
