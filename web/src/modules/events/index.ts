// Public API modul agenda
export { EventCard } from "./components/event-card";
export { EventsView } from "./components/events-view";
export { getEvents, getUpcomingEvents } from "./queries";
export type { EventFilter } from "./queries";

// --- Dashboard (admin) ---
export { deleteEvent, saveEvent } from "./admin-actions";
export { getAdminEvents, type AdminEvent } from "./admin-queries";
export { EventManager } from "./components/event-manager";
