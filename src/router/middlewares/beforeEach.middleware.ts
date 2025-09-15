import type { RouteLocation, NavigationGuardNext } from "vue-router";
import { loaderProgressOff } from "vueless";

export default async (to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
  loaderProgressOff("any");

  next();
};
