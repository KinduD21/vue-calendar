export default {
  path: "/",
  name: "MainLayout",
  redirect: { name: "CalendarPage" },
  component: () => import("@/layouts/Main/index.vue"),
  children: [],
};
