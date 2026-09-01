/** Fecha local YYYY-M-D para «una vez por día». */
export function getLocalDayKey(date = new Date()): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function wasPopupDismissedToday(storageKey: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(storageKey) === getLocalDayKey();
  } catch {
    return false;
  }
}

export function dismissPopupForToday(storageKey: string): void {
  try {
    localStorage.setItem(storageKey, getLocalDayKey());
  } catch {
    /* ignore */
  }
}

export function shouldShowPopupOncePerDay(
  storageKey: string,
  preview = false,
): boolean {
  if (preview) return true;
  return !wasPopupDismissedToday(storageKey);
}
