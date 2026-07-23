import { TodayMedicine } from "../types/medicine.types";

// A small localStorage-backed cache — deliberately not IndexedDB. The data involved
// (today's medicine list, a short queue of pending "mark as taken" actions) is tiny
// JSON, well within localStorage's limits, and synchronous access keeps the calling
// code simple. This gives data resilience while offline, not a full offline app shell.
const TODAY_MEDICINES_KEY = "medimate:offline:todayMedicines";
const PENDING_TAKES_KEY = "medimate:offline:pendingTakes";

export interface PendingTakeAction {
  medicineId: string;
  scheduledTime: string;
  queuedAt: string;
}

const readJSON = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const writeJSON = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (e.g. private browsing) — the cache is best-effort.
  }
};

export const offlineStore = {
  saveTodayMedicines(medicines: TodayMedicine[]) {
    writeJSON(TODAY_MEDICINES_KEY, medicines);
  },

  loadTodayMedicines(): TodayMedicine[] | null {
    return readJSON<TodayMedicine[]>(TODAY_MEDICINES_KEY);
  },

  getPendingTakes(): PendingTakeAction[] {
    return readJSON<PendingTakeAction[]>(PENDING_TAKES_KEY) ?? [];
  },

  queueTake(action: PendingTakeAction) {
    writeJSON(PENDING_TAKES_KEY, [...offlineStore.getPendingTakes(), action]);
  },

  setPendingTakes(actions: PendingTakeAction[]) {
    writeJSON(PENDING_TAKES_KEY, actions);
  },
};

// A network-level failure (fetch couldn't even reach the server) throws a TypeError,
// distinct from an HTTP error response — that's the signal we treat as "offline",
// rather than every failed request (auth errors, validation errors, etc).
export const isNetworkFailure = (error: unknown): boolean =>
  (typeof navigator !== "undefined" && !navigator.onLine) || error instanceof TypeError;
