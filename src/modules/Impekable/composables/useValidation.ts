import { computed, type Ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useModuleI18n } from "../composables/useI18n";

interface FormData {
  title: string;
  date: string | Date;
}

export function useValidation(form: Ref<FormData>) {
  const { t } = useModuleI18n();

  const rules = {
    title: { required },
    date: { required },
  };

  const v$ = useVuelidate(rules, form);

  const titleError = computed(() => {
    const isDirty = v$.value.title.$dirty;
    const isEmpty = v$.value.title.required.$invalid;

    return isDirty && isEmpty ? t("validation.required") : "";
  });

  const dateError = computed(() => {
    const isDirty = v$.value.date.$dirty;
    const isEmpty = v$.value.date.required.$invalid;

    return isDirty && isEmpty ? t("validation.required") : "";
  });

  const validate = () => {
    v$.value.$touch();

    return !v$.value.$invalid;
  };

  return {
    titleError,
    dateError,
    validate,
    t,
  };
}
